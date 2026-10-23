'use strict';
/* =====================================================================
   Notifikácie – zvonček v hornej lište.
   Vznikajú z udalostí dema, rešpektujú prepínače v Profile (S.notif),
   kind: pred | chal | state | price | month | badge
   ===================================================================== */
const NOTE_IC={pred:'sun',chal:'star',state:'group',price:'coins',month:'chart',badge:'award'};
/* notifikácie aktuálnej persony (Operátor ich nemá) */
const myNotes=()=>S.persona==='admin'?[]:S.notes.filter(n=>n.for==='both'||n.for===S.persona).sort((a,b)=>b.day-a.day||String(b.t).localeCompare(String(a.t)));
/* who: anna | peter | both; go: obrazovka (napr. 'group', 'reports:inv');
   o.key: tá istá neprečítaná notifikácia sa aktualizuje namiesto pridania novej */
function notify(kind,who,title,text,go,o={}){
  if(kind!=='badge'&&S.notif&&S.notif[kind]===false)return;
  const t=new Date().toLocaleTimeString('sk-SK',{hour:'2-digit',minute:'2-digit'});
  /* používateľ je práve na danej obrazovke → nevznikne neprečítaná (toast stačí) */
  const here=(who==='both'||who===S.persona)&&curView()===String(go).split(':')[0];
  const key=o.key?o.key+':'+who:null,ex=key&&S.notes.find(n=>n.key===key&&!n.read);
  if(ex){Object.assign(ex,{title,text,t,day:S.day,read:here});return}
  S.notes.unshift({id:'n'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),key,day:S.day,t,kind,for:who,title,text,go,read:here});
  if(S.notes.length>40)S.notes.length=40;
}
/* posun času (prehrávanie dňa alebo živé hodiny) – 30 min pred slnečným oknom */
function notifyTick(from,to){
  const P=profiles(S.c.appTime),w=bestWin(P.fp.map((v,i)=>Math.min(v,P.fc[i])));if(!w)return;
  const at=Math.max(0,w.a-2);
  if(from<at&&to>=at)notify('pred','both','Slnečné okno o '+I2T(w.a),`Od ${I2T(w.a)} do ${I2T(w.b)} je elektrina od susedov najlacnejšia – teraz je čas zapnúť práčku či nabíjanie.`,'home',{key:'pred'+S.day});
}
function bellPanel(){
  const L=myNotes(),un=L.filter(n=>!n.read).length;
  return `<div class="modal-bg bell-bg" data-act="closemodal"><div class="bellpanel" role="dialog" aria-modal="true" aria-label="Notifikácie">
   <div class="row between"><div><span class="kicker" style="margin-bottom:2px">Notifikácie</span><b>${un?un+' neprečítané':'Všetko prečítané'}</b></div><div class="row">${un?`<button class="link" data-act="notesread">Označiť všetko</button>`:''}<button class="btn sm" data-act="closemodal" aria-label="Zavrieť">✕</button></div></div>
   <div class="notes">${L.length?L.map(n=>`<button class="note ${n.read?'':'unread'}" data-act="note:${n.id}"><span class="note-ic">${icon(NOTE_IC[n.kind]||'info')}</span><span class="note-b"><b>${esc(n.title)}</b><span>${esc(n.text)}</span><span class="note-t">${n.day?'Deň '+n.day+' · ':''}${n.t}</span></span>${n.read?'':'<i class="note-dot" aria-label="neprečítané"></i>'}</button>`).join(''):`<p class="sm mut" style="padding:20px 4px">Zatiaľ nič nové. Ozveme sa pred slnečným oknom.</p>`}</div>
   <p class="xs mut" style="margin-top:8px">Čo vám posielame, nastavíte v <button class="link" data-act="view:profile">Profile</button>.</p></div></div>`;
}
