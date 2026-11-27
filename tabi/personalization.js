/* Profile appearance and family avatars. Uploaded photos stay on this device. */
(function(){
  'use strict';
  const PRESETS=[['lime','Лайм'],['blue','Блю'],['pink','Пинки'],['mint','Мята'],['violet','Вайолет'],['peach','Персик']];
  const THEMES=[['light','Светлая'],['dark','Тёмная'],['system','Как на устройстве']];
  const ACCENTS=[['green','Зелёный'],['blue','Синий'],['pink','Розовый']];
  const text=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function avatarSrc(value){
    if(PRESETS.some(([id])=>id===value))return 'avatars/'+value+'.webp';
    if(typeof value==='string'&&value.length<=220000&&/^data:image\/(?:webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(value))return value;
    return '';
  }
  function avatar(member){
    const src=avatarSrc(member?.avatar);
    return src?`<img src="${src}" alt="" decoding="async">`:`<span class="avatar-initial">${text((member?.name||'?').trim().charAt(0).toUpperCase()||'?')}</span>`;
  }
  function appearanceHint(){const state=TabiAppearance.get();return (THEMES.find(([id])=>id===state.theme)?.[1]||'')+' · '+(ACCENTS.find(([id])=>id===state.accent)?.[1]||'')}
  function appearancePanel(){
    const state=TabiAppearance.get();
    return `<div class="appearance-panel"><p class="setting-label" id="theme-label">Тема приложения</p>
      <div class="theme-choices" role="group" aria-labelledby="theme-label">${THEMES.map(([id,label])=>`<button type="button" class="theme-choice tap ${state.theme===id?'selected':''}" data-personal="theme" data-value="${id}" aria-pressed="${state.theme===id}"><span class="theme-demo theme-demo-${id}" aria-hidden="true"><i></i><i></i><i></i></span><span>${label}</span><span class="choice-tick" aria-hidden="true">✓</span></button>`).join('')}</div>
      <p class="setting-help">«Как на устройстве» автоматически меняет тему вместе с телефоном.</p>
      <p class="setting-label" id="accent-label">Акцентный цвет</p><div class="accent-choices" role="group" aria-labelledby="accent-label">${ACCENTS.map(([id,label])=>`<button type="button" class="accent-choice tap ${state.accent===id?'selected':''}" data-personal="accent" data-value="${id}" aria-pressed="${state.accent===id}"><span class="accent-swatch swatch-${id}" aria-hidden="true">${state.accent===id?'✓':''}</span><span>${label}</span></button>`).join('')}</div>
      <p class="setting-help">Ваш выбор сохраняется на этом устройстве.</p></div>`;
  }
  function profileCard(member){return `<section class="identity-card" aria-label="Ваш профиль"><button type="button" class="profile-avatar avatar-button tap" data-personal="avatar-open" data-member="0" aria-label="Изменить аватар ${text(member?.name||'профиля')}">${avatar(member)}<span class="avatar-edit-dot" aria-hidden="true">+</span></button><div class="identity-copy"><strong>${text(member?.name||'Мой профиль')}</strong><button type="button" class="avatar-link" data-personal="avatar-open" data-member="0">Изменить аватар</button><span>Фото или персонаж tabi</span></div></section>`}
  let selectedMember=null,session=0,trigger=null,busy=false;
  function setError(message){const error=document.getElementById('avatar-status');if(error)error.textContent=message}
  function closeAvatar(){session++;selectedMember=null;busy=false;closeSheet();const previous=trigger,index=+previous?.dataset.member;if(WIZ!=null)render();setTimeout(()=>{const target=previous?.isConnected?previous:document.querySelector(`[data-personal="avatar-open"][data-member="${index}"]`);target?.focus()},220)}
  function openAvatar(index,button){
    const member=S.family[index];if(!member)return;
    session++;selectedMember=member;trigger=button;busy=false;
    openSheet(`<section class="avatar-editor" id="avatar-dialog" role="dialog" aria-modal="true" aria-labelledby="avatar-title"><div class="shead"><h2 class="lt" id="avatar-title" style="font-size:26px">Ваш аватар</h2><button class="rb" type="button" data-personal="avatar-close" aria-label="Закрыть выбор аватара">${I.x}</button></div>
      <p class="avatar-subtitle">Для ${text(member.name||'участника семьи')}. Выберите персонажа или своё фото.</p>
      <div class="avatar-current" aria-label="Текущий аватар">${avatar(member)}</div>
      <div class="avatar-grid" role="group" aria-label="Персонажи tabi">${PRESETS.map(([id,name])=>`<button type="button" class="avatar-preset tap ${member.avatar===id?'selected':''}" data-personal="avatar-preset" data-value="${id}" aria-label="Выбрать аватар ${name}" aria-pressed="${member.avatar===id}"><img src="avatars/${id}.webp" alt="" decoding="async"><span>${name}</span><i class="preset-tick" aria-hidden="true">✓</i></button>`).join('')}</div>
      <input type="file" id="avatar-file" accept="image/jpeg,image/png,image/webp" hidden>
      <button type="button" class="btn avatar-upload tap" data-personal="avatar-upload">${I.plus} Загрузить своё фото</button>
      <p class="setting-help">JPG, PNG или WebP до 10 МБ. Фото останется только на этом устройстве.</p>
      <p id="avatar-status" class="avatar-status" role="status" aria-live="polite"></p>
      ${member.avatar?'<button type="button" class="avatar-remove" data-personal="avatar-remove">Вернуть инициалы</button>':''}</section>`);
    requestAnimationFrame(()=>document.querySelector('#avatar-dialog button')?.focus());
  }
  function commitAvatar(value){
    const member=selectedMember;if(!member||!S.family.includes(member))return false;
    const previous=member.avatar;
    if(value)member.avatar=value;else delete member.avatar;
    try{save()}catch(e){if(previous===undefined)delete member.avatar;else member.avatar=previous;setError('Не получилось сохранить фото. Освободите немного памяти браузера или выберите персонажа.');return false}
    closeAvatar();if(WIZ==null)rerenderBody();return true;
  }
  async function uploadPhoto(file){
    if(!file||!selectedMember||busy)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)){setError('Выберите фото в формате JPG, PNG или WebP.');return}
    if(file.size>10*1024*1024){setError('Фото слишком большое. Выберите файл до 10 МБ.');return}
    const token=session,member=selectedMember;busy=true;setError('Подготавливаем фото…');
    const button=document.querySelector('[data-personal="avatar-upload"]');if(button)button.disabled=true;
    const url=URL.createObjectURL(file);
    try{
      const image=new Image();image.src=url;await image.decode();
      if(image.naturalWidth*image.naturalHeight>30000000)throw new Error('dimensions');
      const edge=Math.min(image.naturalWidth,image.naturalHeight);if(!edge)throw new Error('decode');
      const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
      const ctx=canvas.getContext('2d');if(!ctx)throw new Error('canvas');
      ctx.drawImage(image,(image.naturalWidth-edge)/2,(image.naturalHeight-edge)/2,edge,edge,0,0,256,256);
      const encoded=canvas.toDataURL('image/webp',.86);
      if(!avatarSrc(encoded))throw new Error('size');
      if(token===session&&member===selectedMember)commitAvatar(encoded);
    }catch(e){if(token===session)setError(e.message==='dimensions'?'Разрешение фото слишком большое. Выберите уменьшенную копию.':'Не получилось прочитать фото. Попробуйте другой JPG, PNG или WebP.')}
    finally{URL.revokeObjectURL(url);if(token===session){busy=false;if(button?.isConnected)button.disabled=false;const input=document.getElementById('avatar-file');if(input)input.value=''}}
  }
  function refreshAppearance(){
    const state=TabiAppearance.get();
    document.querySelectorAll('[data-personal="theme"],[data-personal="accent"]').forEach(button=>{
      const chosen=state[button.dataset.personal]===button.dataset.value;button.classList.toggle('selected',chosen);button.setAttribute('aria-pressed',String(chosen));
      const swatch=button.querySelector('.accent-swatch');if(swatch)swatch.textContent=chosen?'✓':'';
    });
    const hint=document.querySelector('[data-k="p:appearance"] summary small');if(hint)hint.textContent=appearanceHint();
  }
  document.addEventListener('click',event=>{
    if(event.target.matches('.sheet')&&document.getElementById('avatar-dialog')){event.stopImmediatePropagation();closeAvatar();return}
    const button=event.target.closest('[data-personal]');if(!button)return;
    const action=button.dataset.personal;
    if(action==='theme'||action==='accent'){
      if(!TabiAppearance.set(action,button.dataset.value))toast('Настройка применена, но браузер не смог её сохранить');
    }else if(action==='avatar-open')openAvatar(+button.dataset.member,button);
    else if(action==='avatar-close')closeAvatar();
    else if(action==='avatar-preset'){if(PRESETS.some(([id])=>id===button.dataset.value))commitAvatar(button.dataset.value)}
    else if(action==='avatar-remove')commitAvatar(null);
    else if(action==='avatar-upload')document.getElementById('avatar-file')?.click();
  });
  document.addEventListener('change',event=>{if(event.target.id==='avatar-file')uploadPhoto(event.target.files?.[0])});
  document.addEventListener('keydown',event=>{
    const dialog=document.getElementById('avatar-dialog');if(!dialog||dialog.closest('.sheet.out'))return;
    if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeAvatar();return}
    if(event.key!=='Tab')return;
    const buttons=[...dialog.querySelectorAll('button:not([disabled]),input:not([hidden])')].filter(node=>node.getClientRects().length);
    const first=buttons[0],last=buttons.at(-1);if(!first)return;
    if(event.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){event.preventDefault();first.focus()}
  });
  window.addEventListener('tabi:appearance',refreshAppearance);
  window.TabiPersonal={avatar,avatarSrc,appearancePanel,appearanceHint,profileCard};
})();
