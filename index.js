import predlogs from "./predlogi.json";

const regexFn = new RegExp(
  `(?<=[^A-Za-zА-ЯЁа-яё]|^)(${predlogs.join("|")})(\\s)`,
  "gmi"
);

const addNbspBeforeRegexp = (el, rFn) => {
  el.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      let temp = node.textContent;
      node.textContent = temp.replace(rFn, "$1\u00a0");
    } else {
      setTimeout(() => {
        addNbspBeforeRegexp(node, rFn);
      }, 0);
    }
  });
};

export const dpr = (el) => {
  addNbspBeforeRegexp(el, regexFn)
};

/**
 * Плагин добавляет директиву v-predlogi
 * проходится по элементу и всем его потомках добавляя перед всеми предлогами `&nbsp;`
 * чтобы избавиться от висячих предлогов
 */
export default {
  install(Vue) {
    Vue.directive("predlogi", {
      bind(el) {
        addNbspBeforeRegexp(el, regexFn);
      },
      updated(el) {
        addNbspBeforeRegexp(el, regexFn);
        // eslint-disable-next-line no-console
        console.log("updated", el);
      }
    });
  }
};
