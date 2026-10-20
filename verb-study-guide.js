/* Plain-English reading guide for every workbook section and topic. */
((scope) => {
  const types = {
    1: { label: "Type 1 · regular -ER", definition: "Most verbs ending in -er follow this pattern: remove -er, then add the ending for the subject and tense. Parler and manger belong here. Manger sometimes keeps an extra e to preserve its soft g sound. Aller is an exception: it belongs to Type 3." },
    2: { label: "Type 2 · regular -IR", definition: "These -ir verbs follow the finir pattern, with -issons for nous in the present and -issant in the present participle. Finir and choisir belong here. An -ir ending alone does not make a verb Type 2." },
    3: { label: "Type 3 · irregular verbs", definition: "These verbs follow other patterns, so learn their changing stems and key forms by family. Prendre and faire belong here. This group also includes many irregular -ir verbs, -re and -oir verbs, and aller." }
  };
  const sections = {
    "Conjugations": "How the verb changes with its subject, time and mood. Simple forms use one verb; compound forms use a helping verb plus a past participle.",
    "Additional forms": "Other useful verb constructions, including participles and ways to say that something is happening, has just happened or is about to happen.",
    "Grammar & usage": "How the verb fits into a sentence: statements, negatives, questions, reflexive verbs, passive voice and agreement."
  };
  const topics = {
    "Présent": ["Present", "For what happens now, habits and general truths. French uses this for both ‘I eat’ and ‘I am eating’."],
    "Imparfait": ["Imperfect past", "For past habits, background descriptions and actions that were in progress: ‘I used to eat’ or ‘I was eating’."],
    "Passé composé": ["Completed past", "For a completed past action: ‘I ate’ or ‘I have eaten’. These six verbs use present-tense avoir plus the past participle."],
    "Plus-que-parfait": ["Past perfect", "For something that had already happened before another past event: ‘I had eaten’. Use imperfect avoir plus the past participle."],
    "Futur simple": ["Simple future", "For what will happen: ‘I will eat’. Add future endings to the future stem; some verbs have an irregular stem."],
    "Futur antérieur": ["Future perfect", "For something that will have happened by a future point: ‘I will have eaten’. Use future avoir plus the past participle."],
    "Conditionnel présent": ["Present conditional", "For what would happen, a hypothetical result or a polite request: ‘I would eat’. Use the future stem with imperfect endings."],
    "Conditionnel passé": ["Past conditional", "For what would have happened: ‘I would have eaten’. Use conditional avoir plus the past participle."],
    "Subjonctif présent": ["Present subjunctive", "Often follows que after wishes, necessity, emotion or doubt: ‘It is necessary that I eat’. It expresses a viewpoint rather than simply stating a fact."],
    "Subjonctif passé": ["Past subjunctive", "For a completed action in a subjunctive setting: ‘I am glad that you have eaten’. Use subjunctive avoir plus the past participle."],
    "Impératif": ["Commands and invitations", "For ‘Eat!’, ‘Let’s eat!’ or ‘Please eat’. The subject pronoun is omitted; the forms correspond to tu, nous and vous."],
    "Passé simple (literary)": ["Literary simple past", "A completed past action in novels and formal historical writing. Everyday conversation usually uses the passé composé instead."],
    "Passé antérieur (literary)": ["Literary past perfect", "For something completed just before another past event in literary writing. Use passé simple avoir plus the past participle."],
    "Subjonctif imparfait (literary)": ["Literary imperfect subjunctive", "A formal written subjunctive often used after a past-tense main clause. In ordinary modern French, the present subjunctive usually takes its place."],
    "Subjonctif plus-que-parfait (literary)": ["Literary pluperfect subjunctive", "For an earlier completed action in a literary subjunctive setting. Use imperfect-subjunctive avoir plus the past participle. Modern usage usually prefers the past subjunctive."],
    "Gerund (en + present participle)": ["While / by doing", "En plus the present participle explains how or while doing something: ‘while eating’ or ‘by speaking’. It normally shares the subject of the main action."],
    "Near future (aller + infinitive)": ["Going to do something", "Use present-tense aller plus the infinitive: je vais manger means ‘I am going to eat’. Only aller changes with the subject."],
    "Past imperative (rare)": ["Have it done by then", "A rare command asking for an action to be finished by a deadline: ‘Have finished by noon’. Use imperative avoir plus the past participle."],
    "Past infinitive": ["To have done", "Avoir plus the past participle describes an action completed before another one, often after après: après avoir mangé means ‘after having eaten’."],
    "Past participle": ["The completed-action form", "Forms such as parlé, fini, pris and fait combine with a helping verb to make compound tenses. They can also describe a state and may need agreement."],
    "Present participle": ["The -ant form", "Forms such as parlant and finissant can describe an ongoing action. Usually start with the present nous form, remove -ons and add -ant."],
    "Present progressive (être en train de)": ["In the middle of doing", "Use être en train de plus the infinitive to stress that something is happening right now. The ordinary present can also mean ‘am doing’."],
    "Recent past (venir de + infinitive)": ["Have just done", "Use present-tense venir de plus the infinitive: je viens de manger means ‘I have just eaten’. Only venir changes with the subject."],
    "Affirmative": ["A positive statement", "A sentence that states something is the case. In a basic statement, the subject comes before the conjugated verb, followed by any objects or other details."],
    "Negation": ["Saying not", "Put ne before the conjugated verb and pas after it. With a compound tense, they surround the helping verb. Ne becomes n’ before a vowel sound."],
    "Question (est-ce que)": ["Turning a statement into a question", "Put est-ce que before a statement to ask a yes/no question while keeping normal subject–verb order. Que becomes qu’ before a vowel sound."],
    "Passive voice": ["The subject receives the action", "Use être plus the past participle: ‘The meal is prepared’. Être carries the tense, and the participle agrees with the subject’s gender and number."],
    "Past participle agreement": ["Matching gender and number", "A participle can take -e, -s or -es. With avoir, it agrees with a direct object placed before the verb; with être, it usually agrees with the subject. Reflexive verbs have extra rules."],
    "Pronominal (reflexive)": ["An action involving oneself", "A reflexive pronoun sits before the verb: me, te, se, nous, vous or se. Some verbs describe an action done to oneself; others have a special pronominal meaning."],
    "Pronominal past": ["Reflexive verbs in the past", "Pronominal verbs use être in compound tenses. The reflexive pronoun comes before être. Participle agreement depends on whether the reflexive pronoun is a direct or indirect object."],
    "Literary conditional past (2nd form)": ["A literary way to say would have", "This rare written alternative to the past conditional has the same form as the pluperfect subjunctive. Everyday French uses the ordinary conditionnel passé."]
  };
  function typeFor(verb) {
    return types[verb === "Parler" || verb === "Manger" ? 1 : verb === "Finir" || verb === "Choisir" ? 2 : 3];
  }
  const api = { types, sections, topics, typeFor };
  scope.OghamVerbGuide = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(globalThis);
