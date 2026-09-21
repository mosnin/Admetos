import Swup from "swup";  
import SwupHeadPlugin from "@swup/head-plugin";

const swup = new Swup({  
  animateHistoryBrowsing: true,  
  containers: ["#swup"],  
  plugins: [new SwupHeadPlugin()],  
});  

export { swup };
