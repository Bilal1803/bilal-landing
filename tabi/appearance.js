/* Apply the saved palette before first paint. Independent of menus and family data. */
(function(){
  'use strict';
  const KEY='tabi_appearance_v1';
  const THEMES=['system','light','dark'],ACCENTS=['green','blue','pink'];
  let state={theme:'system',accent:'green'};
  try{const value=JSON.parse(localStorage.getItem(KEY)||'null');if(value&&typeof value==='object'){
    if(THEMES.includes(value.theme))state.theme=value.theme;
    if(ACCENTS.includes(value.accent))state.accent=value.accent;
  }}catch(e){}
  const media=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
  function apply(animate){
    const root=document.documentElement;
    if(animate)root.classList.add('theme-changing');
    const theme=state.theme==='system'?(media?.matches?'dark':'light'):state.theme;
    root.dataset.theme=theme;root.dataset.accent=state.accent;root.dataset.themePreference=state.theme;
    root.style.colorScheme=theme;
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=theme==='dark'?'#101217':'#EEF0F3';
    if(animate){void root.offsetHeight;requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.remove('theme-changing')))}
    window.dispatchEvent(new CustomEvent('tabi:appearance',{detail:{...state,resolvedTheme:theme}}));
  }
  const systemChange=()=>{if(state.theme==='system')apply(true)};
  if(media?.addEventListener)media.addEventListener('change',systemChange);
  else if(media?.addListener)media.addListener(systemChange);
  window.addEventListener('storage',event=>{
    if(event.key!==KEY)return;
    try{const next=JSON.parse(event.newValue||'{}');state={theme:THEMES.includes(next.theme)?next.theme:'system',accent:ACCENTS.includes(next.accent)?next.accent:'green'};apply(true)}catch(e){}
  });
  window.TabiAppearance={
    get:()=>({...state}),
    set:(key,value)=>{
      if(!(key==='theme'?THEMES:key==='accent'?ACCENTS:[]).includes(value))return false;
      state={...state,[key]:value};let stored=true;
      try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){stored=false}
      apply(true);return stored;
    }
  };
  apply(false);
})();
