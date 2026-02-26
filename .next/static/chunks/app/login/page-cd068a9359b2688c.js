(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[626],{70929:function(e,r,n){Promise.resolve().then(n.bind(n,28123))},28123:function(e,r,n){"use strict";n.r(r),n.d(r,{default:function(){return LoginPage}});var d=n(57437),c=n(2265),g=n(24033),f=n(99843),y=n(74962),h=n(5925),b=n(61396),v=n.n(b),x=n(19569),k=n(46484);function LoginPage(){let e=(0,g.useRouter)();(0,y.t)(e=>e.setUser);let r=(0,y.t)(e=>e.setAuth),{t:n}=(0,k.useLanguage)(),[b,j]=(0,c.useState)(""),[C,N]=(0,c.useState)(""),[I,D]=(0,c.useState)(!1),handleSubmit=async d=>{var c,g,y,v,x,k,j,N,I,A,O,L;if(d.preventDefault(),!b.trim()||!C){h.default.error("Please enter email and password");return}D(!0);try{let d=await f.kv.login(b.trim(),C),O=null==d?void 0:d.access_token;if(!O){h.default.error("Invalid response from server"),D(!1);return}let L=null==d?void 0:d.user,T=L?{id:String(null!==(c=L.id)&&void 0!==c?c:""),email:null!==(g=L.email)&&void 0!==g?g:"",full_name:null!==(y=L.full_name)&&void 0!==y?y:"",role:"string"==typeof L.role?L.role:null!==(v=L.role)&&void 0!==v?v:"farmer",region:null!==(x=L.region)&&void 0!==x?x:void 0}:null;if(T)r(O,T);else try{let e=await f.kv.getMe();r(O,{id:String(null!==(k=null==e?void 0:e.id)&&void 0!==k?k:""),email:null!==(j=null==e?void 0:e.email)&&void 0!==j?j:"",full_name:null!==(N=null==e?void 0:e.full_name)&&void 0!==N?N:"",role:"string"==typeof(null==e?void 0:e.role)?e.role:null!==(I=null==e?void 0:e.role)&&void 0!==I?I:"farmer",region:null!==(A=null==e?void 0:e.region)&&void 0!==A?A:void 0})}catch(e){h.default.error("Login succeeded but could not load profile. Please try again."),D(!1);return}h.default.success(n("login_success")),e.push("/")}catch(n){let e=null===(L=n.response)||void 0===L?void 0:null===(O=L.data)||void 0===O?void 0:O.detail,r=Array.isArray(e)?e.map(e=>{var r;return null!==(r=null==e?void 0:e.msg)&&void 0!==r?r:e}).join(", "):e||"Login failed";h.default.error(r)}finally{D(!1)}};return(0,d.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 py-8",children:(0,d.jsxs)(x.E.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md border border-gray-200 dark:border-gray-700",children:[(0,d.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-900 dark:text-white",children:n("login")}),(0,d.jsxs)("form",{onSubmit:handleSubmit,className:"space-y-4",children:[(0,d.jsxs)("div",{children:[(0,d.jsx)("label",{className:"block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100",children:n("email")}),(0,d.jsx)("input",{type:"email",value:b,onChange:e=>j(e.target.value),required:!0,className:"w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"})]}),(0,d.jsxs)("div",{children:[(0,d.jsx)("label",{className:"block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100",children:n("password")}),(0,d.jsx)("input",{type:"password",value:C,onChange:e=>N(e.target.value),required:!0,className:"w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"})]}),(0,d.jsx)("button",{type:"submit",disabled:I,className:"w-full bg-green-600 dark:bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50",children:I?n("logging_in"):n("login")})]}),(0,d.jsxs)("p",{className:"text-center mt-4 text-gray-600 dark:text-gray-300",children:[n("no_account_register")," ",(0,d.jsx)(v(),{href:"/register",className:"text-green-600 dark:text-green-400 hover:underline",children:n("register")})]})]})})}},99843:function(e,r,n){"use strict";n.d(r,{D4:function(){return b},U_:function(){return h},ip:function(){return f},kv:function(){return g},n9:function(){return y}});var d=n(54829);let c=d.Z.create({baseURL:"https://crop-disease-backend-of6r.onrender.com",headers:{"Content-Type":"application/json"}});c.interceptors.request.use(e=>{{let r=localStorage.getItem("token");r&&(e.headers.Authorization="Bearer ".concat(r))}return e.data instanceof FormData&&delete e.headers["Content-Type"],e}),c.interceptors.response.use(e=>e,e=>{var r;return(null===(r=e.response)||void 0===r?void 0:r.status)!==401||window.location.pathname.startsWith("/login")||(localStorage.removeItem("token"),localStorage.removeItem("user"),window.location.href="/login"),Promise.reject(e)});let g={register:async e=>{let r=await c.post("/api/auth/register",e);return r.data},login:async(e,r)=>{let n=new URLSearchParams({email:e.trim().toLowerCase(),password:r}).toString(),d=await c.post("/api/auth/login",n,{headers:{"Content-Type":"application/x-www-form-urlencoded"}});return d.data},getMe:async()=>{let e=await c.get("/api/auth/me");return e.data}},f={predict:async(e,r,n,d)=>{let g=new FormData;g.append("file",e),r&&g.append("crop_type",r),n&&g.append("region",n),d&&g.append("soil_type",d);let f=await c.post("/api/predictions/predict",g);return f.data},getHistory:async function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10,r=await c.get("/api/predictions/history",{params:{limit:e}});return r.data},getById:async e=>{let r=await c.get("/api/predictions/".concat(e));return r.data},getGradCAM:async e=>{let r=await c.get("/api/predictions/gradcam/".concat(e));return r.data},delete:async e=>{let r=await c.delete("/api/predictions/".concat(e));return r.data}},y={getAvailableCrops:async()=>{let e=await c.get("/api/analytics/available-crops");return e.data},getSummary:async e=>{let r=await c.get("/api/analytics/summary",{params:{crop_type:e}});return r.data},getDiseaseFrequency:async(e,r)=>{let n=await c.get("/api/analytics/disease-frequency",{params:{crop_type:e,region:r}});return n.data},getCropHealth:async e=>{let r=await c.get("/api/analytics/crop-health",{params:{crop_type:e}});return r.data},getMonthlyTrends:async e=>{let r=await c.get("/api/analytics/monthly-trends",{params:{crop_type:e}});return r.data},getRegionWise:async e=>{let r=await c.get("/api/analytics/region-wise",{params:{crop_type:e}});return r.data}},h={chat:async(e,r)=>{let n=await c.post("/api/chatbot/chat",{message:e,context:r});return n.data},getSuggestions:async e=>{let r=await c.get("/api/chatbot/suggestions",{params:{crop_type:e}});return r.data}},b={submit:async e=>{let r=await c.post("/api/contact/",e);return r.data}}},5925:function(e,r,n){"use strict";let d,c;n.r(r),n.d(r,{CheckmarkIcon:function(){return G},ErrorIcon:function(){return R},LoaderIcon:function(){return U},ToastBar:function(){return er},ToastIcon:function(){return $},Toaster:function(){return Fe},default:function(){return eo},resolveValue:function(){return dist_h},toast:function(){return dist_n},useToaster:function(){return dist_w},useToasterStore:function(){return V}});var g=n(2265);let f={data:""},t=e=>{if("object"==typeof window){let r=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return r.nonce=window.__nonce__,r.parentNode||(e||document.head).appendChild(r),r.firstChild}return e||f},y=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,h=/\/\*[^]*?\*\/|  +/g,b=/\n+/g,o=(e,r)=>{let n="",d="",c="";for(let g in e){let f=e[g];"@"==g[0]?"i"==g[1]?n=g+" "+f+";":d+="f"==g[1]?o(f,g):g+"{"+o(f,"k"==g[1]?"":r)+"}":"object"==typeof f?d+=o(f,r?r.replace(/([^,])+/g,e=>g.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,r=>/&/.test(r)?r.replace(/&/g,e):e?e+" "+r:r)):g):null!=f&&(g=/^--/.test(g)?g:g.replace(/[A-Z]/g,"-$&").toLowerCase(),c+=o.p?o.p(g,f):g+":"+f+";")}return n+(r&&c?r+"{"+c+"}":c)+d},v={},s=e=>{if("object"==typeof e){let r="";for(let n in e)r+=n+s(e[n]);return r}return e},i=(e,r,n,d,c)=>{var g;let f=s(e),x=v[f]||(v[f]=(e=>{let r=0,n=11;for(;r<e.length;)n=101*n+e.charCodeAt(r++)>>>0;return"go"+n})(f));if(!v[x]){let r=f!==e?e:(e=>{let r,n,d=[{}];for(;r=y.exec(e.replace(h,""));)r[4]?d.shift():r[3]?(n=r[3].replace(b," ").trim(),d.unshift(d[0][n]=d[0][n]||{})):d[0][r[1]]=r[2].replace(b," ").trim();return d[0]})(e);v[x]=o(c?{["@keyframes "+x]:r}:r,n?"":"."+x)}let k=n&&v.g?v.g:null;return n&&(v.g=v[x]),g=v[x],k?r.data=r.data.replace(k,g):-1===r.data.indexOf(g)&&(r.data=d?g+r.data:r.data+g),x},p=(e,r,n)=>e.reduce((e,d,c)=>{let g=r[c];if(g&&g.call){let e=g(n),r=e&&e.props&&e.props.className||/^go/.test(e)&&e;g=r?"."+r:e&&"object"==typeof e?e.props?"":o(e,""):!1===e?"":e}return e+d+(null==g?"":g)},"");function u(e){let r=this||{},n=e.call?e(r.p):e;return i(n.unshift?n.raw?p(n,[].slice.call(arguments,1),r.p):n.reduce((e,n)=>Object.assign(e,n&&n.call?n(r.p):n),{}):n,t(r.target),r.g,r.o,r.k)}u.bind({g:1});let x,k,j,C=u.bind({k:1});function m(e,r,n,d){o.p=r,x=e,k=n,j=d}function w(e,r){let n=this||{};return function(){let d=arguments;function a(c,g){let f=Object.assign({},c),y=f.className||a.className;n.p=Object.assign({theme:k&&k()},f),n.o=/ *go\d+/.test(y),f.className=u.apply(n,d)+(y?" "+y:""),r&&(f.ref=g);let h=e;return e[0]&&(h=f.as||e,delete f.as),j&&h[0]&&j(f),x(h,f)}return r?r(a):a}}var Z=e=>"function"==typeof e,dist_h=(e,r)=>Z(e)?e(r):e,N=(d=0,()=>(++d).toString()),E=()=>{if(void 0===c&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");c=!e||e.matches}return c},I="default",H=(e,r)=>{let{toastLimit:n}=e.settings;switch(r.type){case 0:return{...e,toasts:[r.toast,...e.toasts].slice(0,n)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===r.toast.id?{...e,...r.toast}:e)};case 2:let{toast:d}=r;return H(e,{type:e.toasts.find(e=>e.id===d.id)?1:0,toast:d});case 3:let{toastId:c}=r;return{...e,toasts:e.toasts.map(e=>e.id===c||void 0===c?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===r.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==r.toastId)};case 5:return{...e,pausedAt:r.time};case 6:let g=r.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+g}))}}},D=[],A={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},O={},Y=(e,r=I)=>{O[r]=H(O[r]||A,e),D.forEach(([e,n])=>{e===r&&n(O[r])})},_=e=>Object.keys(O).forEach(r=>Y(e,r)),Q=e=>Object.keys(O).find(r=>O[r].toasts.some(r=>r.id===e)),S=(e=I)=>r=>{Y(r,e)},L={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},V=(e={},r=I)=>{let[n,d]=(0,g.useState)(O[r]||A),c=(0,g.useRef)(O[r]);(0,g.useEffect)(()=>(c.current!==O[r]&&d(O[r]),D.push([r,d]),()=>{let e=D.findIndex(([e])=>e===r);e>-1&&D.splice(e,1)}),[r]);let f=n.toasts.map(r=>{var n,d,c;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||(null==(n=e[r.type])?void 0:n.removeDelay)||(null==e?void 0:e.removeDelay),duration:r.duration||(null==(d=e[r.type])?void 0:d.duration)||(null==e?void 0:e.duration)||L[r.type],style:{...e.style,...null==(c=e[r.type])?void 0:c.style,...r.style}}});return{...n,toasts:f}},ie=(e,r="blank",n)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:r,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...n,id:(null==n?void 0:n.id)||N()}),P=e=>(r,n)=>{let d=ie(r,e,n);return S(d.toasterId||Q(d.id))({type:2,toast:d}),d.id},dist_n=(e,r)=>P("blank")(e,r);dist_n.error=P("error"),dist_n.success=P("success"),dist_n.loading=P("loading"),dist_n.custom=P("custom"),dist_n.dismiss=(e,r)=>{let n={type:3,toastId:e};r?S(r)(n):_(n)},dist_n.dismissAll=e=>dist_n.dismiss(void 0,e),dist_n.remove=(e,r)=>{let n={type:4,toastId:e};r?S(r)(n):_(n)},dist_n.removeAll=e=>dist_n.remove(void 0,e),dist_n.promise=(e,r,n)=>{let d=dist_n.loading(r.loading,{...n,...null==n?void 0:n.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let c=r.success?dist_h(r.success,e):void 0;return c?dist_n.success(c,{id:d,...n,...null==n?void 0:n.success}):dist_n.dismiss(d),e}).catch(e=>{let c=r.error?dist_h(r.error,e):void 0;c?dist_n.error(c,{id:d,...n,...null==n?void 0:n.error}):dist_n.dismiss(d)}),e};var T=1e3,dist_w=(e,r="default")=>{let{toasts:n,pausedAt:d}=V(e,r),c=(0,g.useRef)(new Map).current,f=(0,g.useCallback)((e,r=T)=>{if(c.has(e))return;let n=setTimeout(()=>{c.delete(e),y({type:4,toastId:e})},r);c.set(e,n)},[]);(0,g.useEffect)(()=>{if(d)return;let e=Date.now(),c=n.map(n=>{if(n.duration===1/0)return;let d=(n.duration||0)+n.pauseDuration-(e-n.createdAt);if(d<0){n.visible&&dist_n.dismiss(n.id);return}return setTimeout(()=>dist_n.dismiss(n.id,r),d)});return()=>{c.forEach(e=>e&&clearTimeout(e))}},[n,d,r]);let y=(0,g.useCallback)(S(r),[r]),h=(0,g.useCallback)(()=>{y({type:5,time:Date.now()})},[y]),b=(0,g.useCallback)((e,r)=>{y({type:1,toast:{id:e,height:r}})},[y]),v=(0,g.useCallback)(()=>{d&&y({type:6,time:Date.now()})},[d,y]),x=(0,g.useCallback)((e,r)=>{let{reverseOrder:d=!1,gutter:c=8,defaultPosition:g}=r||{},f=n.filter(r=>(r.position||g)===(e.position||g)&&r.height),y=f.findIndex(r=>r.id===e.id),h=f.filter((e,r)=>r<y&&e.visible).length;return f.filter(e=>e.visible).slice(...d?[h+1]:[0,h]).reduce((e,r)=>e+(r.height||0)+c,0)},[n]);return(0,g.useEffect)(()=>{n.forEach(e=>{if(e.dismissed)f(e.id,e.removeDelay);else{let r=c.get(e.id);r&&(clearTimeout(r),c.delete(e.id))}})},[n,f]),{toasts:n,handlers:{updateHeight:b,startPause:h,endPause:v,calculateOffset:x}}},M=C`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,z=C`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,F=C`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${M} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${z} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,q=C`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,U=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${q} 1s linear infinite;
`,B=C`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,W=C`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,G=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${B} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${W} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,J=w("div")`
  position: absolute;
`,K=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,X=C`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ee=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${X} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,$=({toast:e})=>{let{icon:r,type:n,iconTheme:d}=e;return void 0!==r?"string"==typeof r?g.createElement(ee,null,r):r:"blank"===n?null:g.createElement(K,null,g.createElement(U,{...d}),"loading"!==n&&g.createElement(J,null,"error"===n?g.createElement(R,{...d}):g.createElement(G,{...d})))},Re=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Ee=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,et=w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ea=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ke=(e,r)=>{let n=e.includes("top")?1:-1,[d,c]=E()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[Re(n),Ee(n)];return{animation:r?`${C(d)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${C(c)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},er=g.memo(({toast:e,position:r,style:n,children:d})=>{let c=e.height?ke(e.position||r||"top-center",e.visible):{opacity:0},f=g.createElement($,{toast:e}),y=g.createElement(ea,{...e.ariaProps},dist_h(e.message,e));return g.createElement(et,{className:e.className,style:{...c,...n,...e.style}},"function"==typeof d?d({icon:f,message:y}):g.createElement(g.Fragment,null,f,y))});m(g.createElement);var we=({id:e,className:r,style:n,onHeightUpdate:d,children:c})=>{let f=g.useCallback(r=>{if(r){let l=()=>{d(e,r.getBoundingClientRect().height)};l(),new MutationObserver(l).observe(r,{subtree:!0,childList:!0,characterData:!0})}},[e,d]);return g.createElement("div",{ref:f,className:r,style:n},c)},Me=(e,r)=>{let n=e.includes("top"),d=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:E()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${r*(n?1:-1)}px)`,...n?{top:0}:{bottom:0},...d}},ei=u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Fe=({reverseOrder:e,position:r="top-center",toastOptions:n,gutter:d,children:c,toasterId:f,containerStyle:y,containerClassName:h})=>{let{toasts:b,handlers:v}=dist_w(n,f);return g.createElement("div",{"data-rht-toaster":f||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...y},className:h,onMouseEnter:v.startPause,onMouseLeave:v.endPause},b.map(n=>{let f=n.position||r,y=Me(f,v.calculateOffset(n,{reverseOrder:e,gutter:d,defaultPosition:r}));return g.createElement(we,{id:n.id,key:n.id,onHeightUpdate:v.updateHeight,className:n.visible?ei:"",style:y},"custom"===n.type?dist_h(n.message,n):c?c(n):g.createElement(er,{toast:n,position:f}))}))},eo=dist_n}},function(e){e.O(0,[124,251,829,259,971,472,744],function(){return e(e.s=70929)}),_N_E=e.O()}]);