import "number-flow";
function initStatisticNumber(scope = document) {  
  const root = scope.matches?.("[data-number-flow-stat]")  
    ? scope  
    : scope.querySelector("[data-number-flow-stat]");  
  if (!root) return;

  const cleanupName = "__numberFlowStatisticCleanup";  
  root[cleanupName]?.();

  const flow = root.querySelector("[data-stat-number]");  
  if (!flow) return;

  flow.format = { maximumFractionDigits: 0 };  
  flow.trend = 1;  
  flow.animated = false;  
  flow.numberSuffix = root.dataset.suffix || "";
  flow.update(Number(root.dataset.start || 0));  
  flow.animated = true;

  let observer;  
  const reveal = () => flow.update(Number(root.dataset.value));

  if ("IntersectionObserver" in window) {  
    observer = new IntersectionObserver(  
      ([entry]) => {  
        if (!entry?.isIntersecting) return;  
        reveal();  
        observer.disconnect();  
      },  
      { threshold: 0.5 },  
    );  
    observer.observe(root);  
  } else {  
    reveal();  
  }

  root[cleanupName] = () => {  
    observer?.disconnect();  
    flow.animated = false;  
    delete root[cleanupName];  
  };  
}
export { initStatisticNumber };
