!function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){e.exports=r(1)},function(e,t,r){"use strict";r.r(t);var o=e=>{let t=document.getElementById("search-clear"),r=document.getElementById("search-term");t&&t.addEventListener("click",()=>{r.value=""})};const n=25,a={who_iris:"WHO IRIS",nice:"NICE",parliament:"Parliament",unicef:"UNICEF",msf:"MSF",gov_uk:"Gov.uk"};function s(e){return a[e]}function c(e,t){let r="";r+=e>0?'<li class="page-item btn" id="page-previous">&lt Prev</li>':'<li class="btn disabled-page-item" id="page-previous">&lt Prev</li>';const o=parseInt(Math.ceil(t.hits.total.value/n));e>2&&(r+='<li class="page-item" data-page="0">1</li>',e>3&&(r+='<li class="disabled-page-item">...</li>'));for(let t=Math.max(e-2,0);t<Math.min(e+3,o);++t)r+=t===e?`<li class="page-item active" id="active-page" data-page="${t}">${t+1}</li>`:`<li class="page-item" data-page="${t}">${t+1}</li>`;return e<o-3&&(e<o-4&&(r+='<li class="disabled-page-item">...</li>'),r+=`<li class="page-item" data-page="${o-1}">${o}</li>`),`<ul class="pages">${r+=e<o-1?'<li class="page-item btn" id="page-next">Next &gt</li>':'<li class="disabled-page-item btn" id="page-next">Next &gt</li>'}</ul>`}function i(e,t){e=parseInt(e);let r=n*e+1;return`<span>Showing ${r} - ${Math.min(r+n,t.hits.total.value)} of ${t.hits.total.value} results</span>`}function l(e,t,r){let o=new XMLHttpRequest,n=`/api/search/${e}`+`?terms=${t.term}`+`&fields=${t.fields}`+`&size=${t.size}`+`&sort=${t.sort}`+`&order=${t.order}`+`&page=${t.page+1}`;o.open("GET",n),o.responseType="json",o.send(),o.onload=()=>{200==o.status&&r(o.response,t)},o.onabort=()=>{console.log(o.response)},o.onerror=()=>{console.log(o.response)}}function d(){const e=document.getElementById("active-page"),t=document.getElementById("active-sort");return{term:document.getElementById("search-term").value,size:n,page:e?parseInt(e.getAttribute("data-page")):0,sort:t.getAttribute("data-sort"),order:t.getAttribute("data-order")}}const u=["title","text","organisation","authors"].join(","),g=(e,t)=>{const r=document.getElementById("policy-docs-results-tbody"),o=document.getElementById("loading-row"),n=document.getElementsByClassName("page-item");r.innerHTML=(e=>{let t="";for(let r of e.hits.hits){if(!r._source.doc.url)continue;r._source.doc.authors&&r._source.doc.authors;let e=r._source.doc.title?r._source.doc.title.toTitleCase():"Title unavailable";t+="<tr>",t+=`<td><a\n            href="${r._source.doc.url}"\n            target="_blank"\n            rel="noreferrer noopener"\n        ><span class="icn icn-new-page"></span></td>`,t+=`<td title="${e}"><a\n            href="${r._source.doc.url}"\n            target="_blank"\n            rel="noreferrer noopener"\n        >${e.length>140?e.slice(0,140)+"...":e}</a></td>`,t+=`<td>${s(r._source.doc.organisation)}</td>`,t+=`<td>${r._source.doc.year?r._source.doc.year:"Unknown"}</td>`,t+="</tr>"}return t})(e),r.parentElement.classList.toggle("load"),o.classList.toggle("d-none");for(let r of document.getElementsByClassName("pagination-box"))r.innerHTML=c(t.page,e);for(let r of document.getElementsByClassName("page-counter"))r.innerHTML=i(t.page,e);for(let e of n)e.addEventListener("click",e=>{let t=d(),r=(document.getElementById("active-page"),document.getElementsByClassName("page-item"));document.getElementById("policy-docs-result-table").classList.toggle("load"),document.getElementById("loading-row").classList.toggle("d-none"),t.fields=u;let o=e.currentTarget;"Prev"===o.innerHTML?(t.page-=1,o=r[t.page]):"Next"===o.innerHTML?(t.page+=1,o=r[t.page]):t.page=parseInt(o.getAttribute("data-page")),l("policy-docs",t,g)})};var m=()=>{if(document.getElementById("policy-docs-result-table")){const e=document.getElementsByClassName("sort");for(let t of e)t.addEventListener("click",e=>{let t=e.currentTarget.getAttribute("data-sort"),r=document.getElementById("active-sort"),o=d();document.getElementById("policy-docs-result-table").classList.toggle("load"),document.getElementById("loading-row").classList.toggle("d-none"),o.fields=u,t==r.getAttribute("data-sort")?"asc"===r.getAttribute("data-order")?(o.order="desc",r.setAttribute("data-order","desc"),r.querySelector(".icn").setAttribute("class","icn icn-sorted  icn-sorted-asc")):(o.order="asc",r.setAttribute("data-order","asc"),r.querySelector(".icn").setAttribute("class","icn icn-sorted")):(e.currentTarget.setAttribute("data-order","asc"),r.querySelector(".icn").setAttribute("class","icn icn-sort"),e.currentTarget.querySelector(".icn").setAttribute("class","icn icn-sorted")),r.setAttribute("id",null),e.currentTarget.setAttribute("id","active-sort"),o.sort=t,l("policy-docs",o,g)});let t=d();t.fields=u,l("policy-docs",t,g)}};const p=140,f=["match_title","policies.title","policies.organisation","match_source","match_publication","match_authors"].join(",");function b(e,t){const r=document.getElementById("citations-results-tbody"),o=document.getElementById("loading-row"),n=document.getElementsByClassName("page-item"),a=document.getElementsByClassName("accordion-row");r.innerHTML=function(e){let t="";return e.hits.hits.forEach(e=>{let r=e._source.doc.match_authors?e._source.doc.match_authors:"Authors unavailable",o=e._source.doc.match_title?e._source.doc.match_title.toTitleCase():"Title unavailable";t+=`<tr class="accordion-row" id="accordion-row-${e._source.doc.reference_id}">`,t+='<td class="accordion-arrow"><i class="icon icon-arrow-down mr-1"></i></td>',t+=`<td title="${o}">${o.length>p?o.slice(0,p)+"...":o}</td>`,t+=`<td>${e._source.doc.match_publication}</td>`,t+=`<td class="authors-cell" title="${r}">\n            ${r.length>p?r.slice(0,p)+"...":r}\n        </td>`,t+=`<td>${e._source.doc.match_pub_year}</td>`,t+=`<td>${e._source.doc.policies.length}</td>`,t+="</tr>",t+=`<tr class="accordion-body hidden" id="accordion-body-${e._source.doc.reference_id}">\n                    <td colspan=6 class="accordion-subtable-container">\n                    <table class="table accordion-subtable">\n                        <colgroup>\n                            <col class="colgroup-xl-col">\n                            <col class="colgroup-medium-col">\n                            <col>\n                        </colgroup>\n                        <tr>\n                            <th>Policy Document</th>\n                            <th>Policy Organisation</th>\n                            <th>Publication Year</th>\n                        </tr>\n        `;for(let r of e._source.doc.policies){let o=r.title?r.title.toTitleCase():"Title unavailable";t+="<tr>",t+=`<td title="${o}"><a\n               href="${r.source_url}"\n               target="_blank"\n               rel="noreferrer noopener"\n            >${o.length>p?o.slice(0,p)+"...":o}</a></td>`,t+=`<td>${s(r.organisation)}</td>`,t+=`<td>${e._source.doc.match_pub_year}</td>`}t+="</table></td>",t+="</tr>"}),t}(e),r.parentElement.classList.toggle("load"),o.classList.toggle("d-none");for(let r of document.getElementsByClassName("pagination-box"))r.innerHTML=c(t.page,e);for(let r of document.getElementsByClassName("page-counter"))r.innerHTML=i(t.page,e);for(let e of n)e.addEventListener("click",e=>{e.preventDefault();let t=d(),r=(document.getElementById("active-page"),document.getElementsByClassName("page-item"));t.fields=f,document.getElementById("citations-result-table").classList.toggle("load"),document.getElementById("loading-row").classList.toggle("d-none");let o=e.currentTarget;"page-previous"==o.getAttribute("id")?(t.page-=1,o=r[t.page]):"page-next"==o.getAttribute("id")?(t.page+=1,o=r[t.page]):t.page=parseInt(o.getAttribute("data-page")),l("citations",t,b)});for(let e of a)e.addEventListener("click",e=>{const t=e.currentTarget.getAttribute("id").replace("row","body");document.getElementById(t).classList.toggle("hidden"),e.currentTarget.classList.toggle("active-row"),e.currentTarget.firstChild.firstChild.classList.toggle("icon-arrow-down"),e.currentTarget.firstChild.firstChild.classList.toggle("icon-arrow-up")})}var y=()=>{if(document.getElementById("citations-result-table")){const e=document.getElementsByClassName("sort");for(let t of e)t.addEventListener("click",e=>{let t=e.currentTarget.getAttribute("data-sort"),r=document.getElementById("active-sort"),o=d();document.getElementById("citations-result-table").classList.toggle("load"),document.getElementById("loading-row").classList.toggle("d-none"),o.fields=f,t===o.sort?"asc"===r.getAttribute("data-order")?(o.order="desc",r.setAttribute("data-order","desc"),r.querySelector(".icn").setAttribute("class","icn icn-sorted icn-sorted-asc")):(o.order="asc",r.setAttribute("data-order","asc"),r.querySelector(".icn").setAttribute("class","icn icn-sorted")):(e.currentTarget.setAttribute("data-order","asc"),r.setAttribute("id",null),e.currentTarget.setAttribute("id","active-sort"),r.querySelector(".icn").setAttribute("class","icn icn-sort"),e.currentTarget.querySelector(".icn").setAttribute("class","icn icn-sorted")),o.sort=t,l("citations",o,b)});let t=d();t.fields=f,l("citations",t,b)}};document.addEventListener("DOMContentLoaded",(function(e){String.prototype.toTitleCase=function(){return this.valueOf().toLowerCase().replace(/^\w/,e=>e.toUpperCase())},o(),m(),y()}))}]);
//# sourceMappingURL=main.js.map