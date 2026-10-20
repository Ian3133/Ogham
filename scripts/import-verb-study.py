"""Import the supplied verb reference without modifying its Excel source.

Usage: python scripts/import-verb-study.py path/to/reference.xlsx
The JSON retains source locators and notes any corrections made for spoken French.
"""
import collections
import json
import pathlib
import posixpath
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
NS = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
PRONOUNS = {"je": "I", "tu": "you", "il": "he", "elle": "she", "on": "one", "nous": "we", "vous": "you", "ils": "they", "elles": "they"}
OBJECTS = {"Parler": ("français", "French"), "Manger": ("du pain", "bread"), "Finir": ("le travail", "the work"), "Choisir": ("un livre", "a book"), "Prendre": ("le train", "the train"), "Faire": ("du sport", "exercise / sport")}
PAST = {"Parler": "parlé", "Manger": "mangé", "Finir": "fini", "Choisir": "choisi", "Prendre": "pris", "Faire": "fait"}


def worksheet_rows(archive, path, strings):
    for row in ET.fromstring(archive.read(path)).findall("s:sheetData/s:row", NS):
        values = {}
        for cell in row.findall("s:c", NS):
            value = cell.find("s:v", NS)
            text = value.text if value is not None else ""
            if cell.attrib.get("t") == "s":
                text = strings[int(text)]
            elif cell.attrib.get("t") == "inlineStr":
                text = "".join(cell.find("s:is", NS).itertext())
            if text:
                values[re.sub(r"\d", "", cell.attrib["r"])] = text
        yield int(row.attrib["r"]), values


def spoken_sentence(text, person, choice, topic):
    text = re.sub(r"(?<!\w)" + re.escape(person) + r"(?!\w)", choice, text, flags=re.I) if person not in ["—", "", "All"] else text
    if "Subjonctif imparfait" in topic or "Subjonctif plus-que-parfait" in topic:
        text = text.replace("Il faut que", "Il fallait que")
    text = re.sub(r"\bque ([ieo])", r"qu’\1", text, flags=re.I)
    text = text.replace("'", "’")
    return text[:1].upper() + text[1:]


def english_variant(text, choice, person):
    text = text.replace("he/she/one", PRONOUNS.get(choice.lower(), choice)).replace("he/she", PRONOUNS.get(choice.lower(), choice))
    if person == "il":
        text = re.sub(r"^He\b", PRONOUNS[choice].capitalize(), text)
    return text[:1].upper() + text[1:]


def sentence_parts(sentence, verb, form, section):
    # Keep natural phrases intact. A form is recorded separately as well.
    obj, meaning = OBJECTS[verb]
    clean = sentence.rstrip(" .!?")
    match = re.search(re.escape(obj), clean, re.I)
    if match and section != "Grammar & usage":
        before = clean[:match.start()].strip(" ,")
        after = clean[match.end():].strip(" ,")
        parts = []
        if before:
            parts.append({"text": before, "role": "Action in context", "meaning": "The verb phrase in its sentence context"})
        parts.append({"text": clean[match.start():match.end()], "role": "Complement", "meaning": meaning})
        if after:
            parts.append({"text": after, "role": "More context", "meaning": "Time or additional information"})
        return parts
    # Grammar examples often use another object. Word audio stays available there.
    return [{"text": word, "role": "Word in the sentence", "meaning": "Read it with the full sentence"} for word in re.findall(r"[\wÀ-ÿ]+(?:[’'][\wÀ-ÿ]+)*", clean)]


def form_note(verb, topic, form, person):
    if topic == "Present participle":
        return "This non-finite form ends in -ant and does not change for person. Here it introduces an action alongside the main clause."
    if topic.startswith("Gerund"):
        return "En + present participle expresses how, when, or while an action happens. Its subject normally matches the subject of the main clause."
    if topic == "Past participle":
        return f"{form} is the past participle of {verb.lower()}. Combine it with a helping verb to build compound tenses; agreement depends on the construction."
    if topic == "Past infinitive":
        return "Avoir stays in the infinitive, followed by the past participle. This construction presents an action as already completed, as in après avoir…"
    if topic.startswith("Near future"):
        return "Present-tense aller + the unchanged infinitive expresses what someone is going to do."
    if topic.startswith("Recent past"):
        return "Present-tense venir + de + the unchanged infinitive expresses what someone has just done."
    if topic.startswith("Present progressive"):
        return "Être en train de + the unchanged infinitive emphasizes that the action is in progress."
    if topic.startswith("Past imperative"):
        return "An imperative helping verb + past participle asks for an action to be completed by a deadline. Only tu, nous, and vous forms exist; this construction is rare."
    if verb == "Manger" and topic == "Présent" and person == "nous":
        return "mang + e + ons: the extra e keeps the soft g before o. The person ending is -ons."
    if verb == "Manger" and re.search(r"mangea|mangeâ|mangeai|mangeant", form):
        return "The extra e after g preserves the soft g sound before a or o."
    if " " in form and form.endswith(PAST[verb]):
        return f"The helping verb changes with the person and tense. {PAST[verb]} is the past participle of {verb.lower()}."
    if verb == "Faire" and re.match(r"fer", form):
        return "Faire uses the irregular future/conditional stem fer-. The ending identifies the person and tense."
    if topic == "Présent" and verb in ["Finir", "Choisir"]:
        return "This is the regular second-group -ir pattern. Plural forms use the -iss- stem."
    if topic == "Présent" and verb in ["Parler", "Manger"]:
        return "Present endings: -e, -es, -e, -ons, -ez, -ent. Written endings do not all have a separate sound."
    return f"Compare this form with the other persons in {topic}. Listen to the complete form and the sentence together."


def main():
    source = pathlib.Path(sys.argv[1]).resolve()
    records = []
    verbs = []
    notes = []
    with zipfile.ZipFile(source) as archive:
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            strings = ["".join(item.itertext()) for item in ET.fromstring(archive.read("xl/sharedStrings.xml")).findall("s:si", NS)]
        relationships = {item.attrib["Id"]: item.attrib["Target"] for item in ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))}
        for sheet in ET.fromstring(archive.read("xl/workbook.xml")).findall("s:sheets/s:sheet", NS):
            name = sheet.attrib["name"]
            target = relationships[sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]]
            path = target.lstrip("/") if target.startswith("/") else posixpath.normpath("xl/" + target)
            for number, cells in worksheet_rows(archive, path, strings):
                if name == "Guide":
                    if cells.get("A") in OBJECTS and "B" in cells:
                        verbs.append({"name": cells["A"], "group": cells["B"], "meaning": cells["C"]})
                    continue
                if name in OBJECTS and number >= 5 and all(column in cells for column in "ABCDE"):
                    verb, section, topic, person, form, french, english = name, "Conjugations", cells["A"], cells["B"], cells["C"], cells["D"], cells["E"]
                    rule = form_note(verb, topic, form, person)
                elif name == "Additional Forms" and number >= 5 and all(column in cells for column in "ABCDEF"):
                    verb, section, topic, person, form, french, english = cells["A"], "Additional forms", cells["B"], cells["C"], cells["D"], cells["E"], cells["F"]
                    rule = form_note(verb, topic, form, person)
                elif name == "Grammar & Usage" and number >= 4 and cells.get("B") in OBJECTS and all(column in cells for column in "ABCDE"):
                    verb, section, topic, person, form, french, english = cells["B"], "Grammar & usage", cells["A"], "—", "", cells["C"], cells["D"]
                    rule = cells["E"]
                else:
                    if name == "Grammar & Usage" and cells.get("B") == "All":
                        notes.append(cells["E"])
                    continue
                choices = person.split("/") if "/" in person else [person]
                # Additional Forms abbreviates the third-person subject; offer its shared forms too.
                if person == "il":
                    choices = ["il", "elle", "on"]
                elif person == "ils":
                    choices = ["ils", "elles"]
                variants = []
                for choice in choices:
                    sentence = spoken_sentence(french, person, choice, topic)
                    variants.append({"subject": choice, "sentence": sentence, "english": english_variant(english, choice, person), "parts": sentence_parts(sentence, verb, form, section)})
                corrections = []
                if "que il/elle/on" in french or "que ils/elles" in french:
                    corrections.append("Elided que before vowel-initial pronouns for natural French.")
                if "Subjonctif imparfait" in topic or "Subjonctif plus-que-parfait" in topic:
                    corrections.append("Used Il fallait que to match the source's past-time English example.")
                records.append({"id": f"{name}:{number}", "verb": verb, "section": section, "topic": topic, "person": person, "form": form, "variants": variants, "rule": rule, "source": {"sheet": name, "row": number}, "corrections": corrections})
    result = {"sourceName": source.name, "verbs": verbs, "records": records, "notes": notes}
    output = ROOT / "verb-study-data.json"
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    counts = collections.Counter(record["section"] for record in records)
    print(json.dumps({"output": output.name, "records": len(records), "sections": dict(counts), "sentenceVariants": sum(len(record["variants"]) for record in records)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
