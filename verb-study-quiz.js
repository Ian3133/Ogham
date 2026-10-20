// Question construction for the local listening quiz. No DOM, playback, or saved scores.
((scope) => {
  const normalize = (text) => String(text).normalize("NFC").replace(/[’']/g, "’").replace(/\s+/g, " ").trim();
  const participles = { Parler: "parlé", Manger: "mangé", Finir: "fini", Choisir: "choisi", Prendre: "pris", Faire: "fait" };
  const quote = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  }

  function agreementForms(verb) {
    const base = participles[verb];
    return [...new Set([base, `${base}e`, base.endsWith("s") ? base : `${base}s`, `${base}es`])];
  }

  function allForms(verb, allRecords) {
    return [...new Set([...allRecords.filter((record) => record.verb === verb).map((record) => record.form).filter(Boolean), ...agreementForms(verb)])];
  }

  function targetForm(record, example, allRecords) {
    if (record.form) return record.form;
    return allForms(record.verb, allRecords).sort((a, b) => b.length - a.length).find((form) =>
      new RegExp(`(?:^|[^\\p{L}])${quote(normalize(form))}(?=$|[^\\p{L}])`, "iu").test(normalize(example.sentence))
    ) || "";
  }

  function sameThirdPersonSound(first, second) {
    return first === second || first.replace(/nt$/, "") === second || second.replace(/nt$/, "") === first
      || first.replace(/aient$/, "ait") === second || second.replace(/aient$/, "ait") === first;
  }

  function acceptedForms(record, example, sectionRecords, correct) {
    const pairedSubject = { il: "ils", ils: "il", elle: "elles", elles: "elle" }[example.subject];
    if (!pairedSubject || !record.form) return [correct];
    const paired = sectionRecords.find((other) => other.id !== record.id && other.variants.some((variant) => variant.subject === pairedSubject));
    return paired?.form && sameThirdPersonSound(correct, paired.form) ? [...new Set([correct, paired.form])] : [correct];
  }

  function buildQuestions(sectionRecords, allRecords, recordings, preferences = {}, random = Math.random) {
    const questions = sectionRecords.map((record) => {
      const examples = record.variants.filter((example) => recordings[normalize(example.sentence)]);
      if (!examples.length) return null;
      const example = examples.find((item) => item.subject === preferences[record.id]) || examples[Math.floor(random() * examples.length)];
      const correct = targetForm(record, example, allRecords);
      if (!correct) return null;
      const accepted = acceptedForms(record, example, sectionRecords, correct);
      let pool = [...new Set(sectionRecords.map((other) => targetForm(other, other.variants[0], allRecords)).filter(Boolean))];
      if (pool.length < 2) {
        const agreement = agreementForms(record.verb);
        pool = record.section === "Grammar & usage" && agreement.includes(correct) ? agreement
          : allRecords.filter((other) => other.verb === record.verb && other.section === record.section).map((other) => targetForm(other, other.variants[0], allRecords));
      }
      pool = [...new Set(pool.filter(Boolean))];
      if (pool.length < 2) pool = allForms(record.verb, allRecords);
      const fillers = shuffle(pool.filter((form) => !accepted.includes(form)), random);
      const maxChoices = sectionRecords.length > 1 ? Math.min(6, pool.length) : 4;
      const options = shuffle([...accepted, ...fillers.slice(0, Math.max(1, maxChoices - accepted.length))], random);
      return { id: record.id, record, example, correct, accepted, options };
    }).filter(Boolean);
    return shuffle(questions, random);
  }

  function grade(question, selected) {
    return { selected, correct: question.accepted.includes(selected), exact: selected === question.correct };
  }

  function buildMegaQuestions(allRecords, recordings, preferences = {}, random = Math.random) {
    const groups = new Map();
    for (const record of allRecords) {
      const key = JSON.stringify([record.verb, record.section, record.topic]);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(record);
    }
    return shuffle([...groups.values()].flatMap((group) => buildQuestions(group, allRecords, recordings, preferences, random)), random);
  }

  const api = { buildQuestions, buildMegaQuestions, grade, shuffle, targetForm };
  scope.OghamVerbQuiz = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(globalThis);
