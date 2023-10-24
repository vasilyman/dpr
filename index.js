import predlogs from "./predlogi.json";

const regexFn = new RegExp(
  `(^|\\p{P}|\\p{S}|\\p{Z}|\\p{C}|\\p{M}|\\p{N})(${predlogs.join(
    "|"
  )})([\\r\\n\\t\\f\\v \\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff])`,
  "gmiu"
);

const addNbspBeforeRegexp = (el, rFn) => {

  el.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      let temp = node.textContent;
      while (rFn.test(temp)) {
        temp = temp.replace(rFn, "$1$2\u00a0");
      }
      node.textContent = temp;
    } else {
      setTimeout(() => {
        let start;
        if (process.env.NODE_ENV === "development") {
          start = performance.now();
          performance.mark(`predlogi start tick`);
        }
        addNbspBeforeRegexp(node, rFn);
        performance.mark(
          `predlogin end (after upd Vue): ${performance.now() -
          start}`
        );
      }, 0);
    }
  });
};

/**
 * Плагин добавляет директиву v-predlogi
 * проходится по элементу и всем его потомках добавляя перед всеми предлогами `&nbsp;` (непереносимый пробел)
 * **чтобы избавиться от висячих предлогов**
 */
export default {
  install(Vue) {
    Vue.directive("predlogi", {
      bind(el) {
        addNbspBeforeRegexp(el, regexFn);
      },
      updated(el) {
        addNbspBeforeRegexp(el, regexFn);
      }
    });
  }
};
