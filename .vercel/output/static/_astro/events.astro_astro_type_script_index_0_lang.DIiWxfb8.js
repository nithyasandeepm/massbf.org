let H=!1;const m=["January","February","March","April","May","June","July","August","September","October","November","December"],q=["Su","Mo","Tu","We","Th","Fr","Sa"];let f=!1,u=new Date().getFullYear(),d=new Date().getMonth(),r=null,l=null;function E(e,t){return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()}function J(e,t,n){return e>t&&e<n}let Y=0;function S(e){return(e||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;")}function w(e,t){const n=document.getElementById(`hl-${e}`);n&&(n.innerHTML=t.map(o=>{const i=`hl-r-${e}-${Y++}`;return`<div id="${i}" class="hl-row" style="display:flex;gap:0.35rem;margin-bottom:0.3rem;align-items:center;">
          <input class="hl-name" type="text" value="${S(o.name)}" placeholder="Name"
            style="flex:1;padding:0.32rem 0.5rem;border:1px solid #D1D5DB;border-radius:5px;font-size:0.81rem;box-sizing:border-box;min-width:0;" />
          <input class="hl-url" type="url" value="${S(o.url)}" placeholder="URL (optional)"
            style="flex:1.5;padding:0.32rem 0.5rem;border:1px solid #D1D5DB;border-radius:5px;font-size:0.81rem;box-sizing:border-box;min-width:0;" />
          <button type="button" onclick="document.getElementById('${i}').remove()"
            style="background:none;border:none;color:#CC2222;cursor:pointer;font-size:0.95rem;flex-shrink:0;padding:0 0.2rem;line-height:1;">✕</button>
        </div>`}).join(""))}function I(e){const t=document.getElementById(`hl-${e}`);return t?Array.from(t.querySelectorAll(".hl-row")).map(n=>({name:n.querySelector(".hl-name")?.value.trim()||"",url:n.querySelector(".hl-url")?.value.trim()||""})).filter(n=>n.name):[]}function M(e){return e.map(t=>t.url?`<a href="${t.url.replace(/"/g,"")}" target="_blank" rel="noopener"
            style="display:block;color:#1B3A8F;font-size:0.83rem;padding:0.18rem 0;text-decoration:none;border-bottom:1px solid #F3F4F6;">${t.name} <span style="opacity:0.55;font-size:0.75rem;">↗</span></a>`:`<span style="display:block;color:#374151;font-size:0.83rem;padding:0.18rem 0;border-bottom:1px solid #F3F4F6;">${t.name}</span>`).join("")}window.toggleHlModal=function(){const e=document.getElementById("hl-modal-body"),t=document.getElementById("hl-modal-icon"),n=e.style.display==="none"||!e.style.display;e.style.display=n?"flex":"none",t.textContent=n?"▼":"▶"};window.hlAddEntry=function(e){const t=`hl-r-${e}-${Y++}`,n=`<div id="${t}" class="hl-row" style="display:flex;gap:0.35rem;margin-bottom:0.3rem;align-items:center;">
        <input class="hl-name" type="text" placeholder="Name"
          style="flex:1;padding:0.32rem 0.5rem;border:1px solid #D1D5DB;border-radius:5px;font-size:0.81rem;box-sizing:border-box;min-width:0;" />
        <input class="hl-url" type="url" placeholder="URL (optional)"
          style="flex:1.5;padding:0.32rem 0.5rem;border:1px solid #D1D5DB;border-radius:5px;font-size:0.81rem;box-sizing:border-box;min-width:0;" />
        <button type="button" onclick="document.getElementById('${t}').remove()"
          style="background:none;border:none;color:#CC2222;cursor:pointer;font-size:0.95rem;flex-shrink:0;padding:0 0.2rem;line-height:1;">✕</button>
      </div>`;document.getElementById(`hl-${e}`).insertAdjacentHTML("beforeend",n),document.getElementById(t).querySelector(".hl-name").focus()};window.toggleHelpfulLinks=function(e){const t=document.getElementById(`hl-panel-${e}`),n=document.getElementById(`hl-arrow-${e}`),o=t.style.display==="none"||!t.style.display;t.style.display=o?"grid":"none",n.textContent=o?"▼":"▶"};function P(e,t){return!e||!t?"":E(e,t)?`${m[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`:e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()?`${m[e.getMonth()]} ${e.getDate()}–${t.getDate()}, ${e.getFullYear()}`:e.getFullYear()===t.getFullYear()?`${m[e.getMonth()]} ${e.getDate()} – ${m[t.getMonth()]} ${t.getDate()}, ${e.getFullYear()}`:`${m[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()} – ${m[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`}function U(e){let t=e.match(/^(\w+)\s+(\d+)[–\-](\d+),\s*(\d+)$/);if(t){const n=m.indexOf(t[1]);if(n>=0)return{start:new Date(+t[4],n,+t[2]),end:new Date(+t[4],n,+t[3])}}if(t=e.match(/^(\w+)\s+(\d+),\s*(\d+)$/),t){const n=m.indexOf(t[1]);if(n>=0){const o=new Date(+t[3],n,+t[2]);return{start:o,end:o}}}if(t=e.match(/^(\w+)\s+(\d+)\s*[–\-]\s*(\w+)\s+(\d+),\s*(\d+)$/),t){const n=m.indexOf(t[1]),o=m.indexOf(t[3]);if(n>=0&&o>=0)return{start:new Date(+t[5],n,+t[2]),end:new Date(+t[5],o,+t[4])}}return{start:null,end:null}}function R(e){return`${m[e.getMonth()].slice(0,3)} ${e.getDate()}, ${e.getFullYear()}`}function F(){const e=document.getElementById("date-display-text"),t=document.getElementById("t-dates"),n=P(r,l);n?(e.textContent=n,e.style.color="#374151",t.value=n):(e.textContent="Click to set From and To dates",e.style.color="#9CA3AF",t.value="")}function B(){const e=document.getElementById("date-picker-popup"),t=new Date(u,d,1).getDay(),n=new Date(u,d+1,0).getDate(),o=new Date,i=!!(r&&!l),a=!!(r&&l),g=i||a?"FROM ✓":"FROM",p=i?"TO  ← selecting":a?"TO ✓":"TO",s=r?"#1B3A8F":"#9CA3AF",c=l?"#1B3A8F":"#9CA3AF",b=r?"#059669":i?"#9CA3AF":"#F37021",x=i?"#F37021":l?"#059669":"#9CA3AF",C=r?l?"Done! Click any day to choose new dates.":"Step 2: Click a later day for a range, or the same day for a 1-day event":"Step 1: Click a day to set the From date";let y=`
        <!-- From / To summary strip -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;background:#F0F4FF;border-radius:8px;overflow:hidden;border:1px solid #E0E7FF;margin-bottom:0.7rem;">
          <div style="padding:0.45rem 0.65rem;border-right:1px solid #E0E7FF;">
            <div style="font-size:0.58rem;font-weight:700;color:${b};text-transform:uppercase;letter-spacing:0.07em;margin-bottom:2px;">${g}</div>
            <div style="font-size:0.78rem;font-weight:700;color:${s};">${r?R(r):"—"}</div>
          </div>
          <div style="padding:0.45rem 0.65rem;">
            <div style="font-size:0.58rem;font-weight:700;color:${x};text-transform:uppercase;letter-spacing:0.07em;margin-bottom:2px;">${p}</div>
            <div style="font-size:0.78rem;font-weight:700;color:${c};">${l?R(l):"—"}</div>
          </div>
        </div>
        <!-- Month nav -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;">
          <button onclick="pickerNav(-1)" style="border:1px solid #E5E7EB;background:white;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:0.9rem;line-height:1;color:#374151;">‹</button>
          <span style="font-weight:700;font-size:0.88rem;color:#1B3A8F;">${m[d]} ${u}</span>
          <button onclick="pickerNav(1)" style="border:1px solid #E5E7EB;background:white;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:0.9rem;line-height:1;color:#374151;">›</button>
        </div>
        <!-- Day headers -->
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;margin-bottom:3px;">
          ${q.map(h=>`<div style="text-align:center;font-size:0.65rem;font-weight:600;color:#9CA3AF;padding:2px 0;">${h}</div>`).join("")}
        </div>
        <!-- Days -->
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;">
          ${"<div></div>".repeat(t)}`;for(let h=1;h<=n;h++){const v=new Date(u,d,h),T=!!(r&&E(v,r)),z=!!(l&&E(v,l)),N=!!(r&&l&&J(v,r,l)),j=E(v,o),_=!!(r&&!l&&v<r);let $="transparent",k="#374151",A="400",L="1";T||z?($="#1B3A8F",k="white",A="700"):N&&($="#DBEAFE",k="#1B3A8F"),_&&(L="0.3"),y+=`<button onclick="pickerDay(${u},${d},${h})"
          style="text-align:center;font-size:0.8rem;padding:5px 2px;border:none;cursor:pointer;background:${$};color:${k};font-weight:${A};border-radius:5px;opacity:${L};${j&&!T&&!z?"box-shadow:inset 0 0 0 1.5px #F37021;":""}line-height:1.4;">
          ${h}</button>`}y+=`</div>
        <!-- Quick single-day button (only when From is set but To isn't) -->
        ${r&&!l?`<button onclick="pickerSameDay()"
          style="width:100%;margin-top:0.55rem;padding:0.45rem;background:#EEF2FF;border:1px solid #C7D2FE;border-radius:6px;font-size:0.78rem;font-weight:600;color:#1B3A8F;cursor:pointer;text-align:center;">
          ↩ 1-day event (same date for From &amp; To)
        </button>`:""}
        <!-- Footer hint + clear -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.55rem;padding-top:0.5rem;border-top:1px solid #F3F4F6;">
          <span style="font-size:0.67rem;color:#9CA3AF;line-height:1.4;flex:1;">${C}</span>
          <button onclick="pickerClear()" style="font-size:0.72rem;color:#CC2222;border:none;background:none;cursor:pointer;flex-shrink:0;margin-left:0.5rem;white-space:nowrap;">Clear</button>
        </div>`,e.innerHTML=y}window.openDatePicker=function(){const e=document.getElementById("date-display"),t=document.getElementById("date-picker-popup");if(f){t.style.display="none",f=!1;return}const n=e.getBoundingClientRect(),o=window.innerWidth,i=Math.min(300,o-16);let a=n.left;a+i>o-8&&(a=o-i-8),a<8&&(a=8),t.style.position="fixed",t.style.top=n.bottom+6+"px",t.style.left=a+"px",t.style.width=i+"px",t.style.display="block",f=!0,B()};window.pickerNav=function(e){d+=e,d<0&&(d=11,u--),d>11&&(d=0,u++),B()};window.pickerDay=function(e,t,n){const o=new Date(e,t,n);!r||r&&l?(r=o,l=null):o>=r?(l=o,document.getElementById("date-picker-popup").style.display="none",f=!1):(r=o,l=null),B(),F()};window.pickerClear=function(){r=null,l=null,F(),B()};window.pickerSameDay=function(){r&&(l=new Date(r.getFullYear(),r.getMonth(),r.getDate()),document.getElementById("date-picker-popup").style.display="none",f=!1,F())};document.addEventListener("click",function(e){const t=document.getElementById("date-picker-popup"),n=document.getElementById("date-display");f&&t&&n&&!n.contains(e.target)&&!t.contains(e.target)&&(t.style.display="none",f=!1)});function W(e){const t=document.getElementById("tournaments-list");if(!e.length){t.innerHTML='<p style="color:#94A3B8;font-size:0.9rem;text-align:center;padding:2rem;">No tournaments yet.</p>';return}t.innerHTML=e.map(n=>{const o=n.status==="upcoming"?"linear-gradient(180deg,#F37021,#CC2222)":"linear-gradient(180deg,#94A3B8,#64748B)",i=n.status==="upcoming"?'<span class="mbf-badge mbf-badge-upcoming">Upcoming</span>':'<span class="mbf-badge mbf-badge-past">Past</span>',a=n.link?`<a href="${n.link}" target="_blank" rel="noopener" style="display:inline-block;margin-top:0.4rem;font-size:0.85rem;color:#1B3A8F;text-decoration:underline;">View Details →</a>`:"",g=H?`
          <div style="display:flex;gap:0.5rem;flex-shrink:0;align-items:center;">
            <button onclick='openTournamentModal(${JSON.stringify(n).replace(/'/g,"&#39;")})'
              style="background:#EEF2FF;color:#1B3A8F;border:1px solid #C7D2FE;padding:0.35rem 0.75rem;border-radius:5px;font-size:0.78rem;font-weight:600;cursor:pointer;">Edit</button>
            <button onclick="deleteTournament('${n.id}')"
              style="background:#FEF2F2;color:#CC2222;border:1px solid #FECACA;padding:0.35rem 0.75rem;border-radius:5px;font-size:0.78rem;font-weight:600;cursor:pointer;">Delete</button>
          </div>`:"",p=n.helpfulLinks||{},s=(p.hotels||[]).filter(y=>y.name),c=(p.carRentals||[]).filter(y=>y.name),b=(p.restaurants||[]).filter(y=>y.name),C=s.length+c.length+b.length>0?`
          <div style="padding:0 1.5rem 1rem 1.5rem;border-top:1px solid #F3F4F6;">
            <button type="button" onclick="toggleHelpfulLinks('${n.id}')"
              style="margin-top:0.55rem;background:none;border:none;cursor:pointer;font-size:0.81rem;font-weight:700;color:#F37021;display:inline-flex;align-items:center;gap:0.35rem;padding:0;">
              <span id="hl-arrow-${n.id}" style="font-size:0.62rem;">▶</span> Helpful Links
            </button>
            <div id="hl-panel-${n.id}"
              style="display:none;margin-top:0.6rem;gap:1.25rem;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));">
              ${s.length?`<div>
                <div style="font-size:0.68rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.35rem;">🏨 Hotels</div>
                ${M(s)}</div>`:""}
              ${c.length?`<div>
                <div style="font-size:0.68rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.35rem;">🚗 Car Rentals</div>
                ${M(c)}</div>`:""}
              ${b.length?`<div>
                <div style="font-size:0.68rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.35rem;">🍽️ Places to Eat</div>
                ${M(b)}</div>`:""}
            </div>
          </div>`:"";return`
          <div class="mbf-card" style="padding:0;overflow:hidden;">
            <div style="display:flex;flex-wrap:wrap;">
              <div style="width:8px;background:${o};flex-shrink:0;"></div>
              <div style="flex:1;overflow:hidden;">
                <div style="padding:1.25rem 1.5rem;display:flex;flex-wrap:wrap;align-items:center;gap:1rem;">
                  <div style="flex:1;min-width:200px;">
                    <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;margin-bottom:0.4rem;">
                      <h3 style="font-size:1.02rem;font-weight:700;color:#1B3A8F;margin:0;">${n.name}</h3>${i}
                    </div>
                    <span style="font-size:0.88rem;color:#6B7280;">📅 ${n.dates}</span>${a}
                  </div>
                  ${g}
                </div>
                ${C}
              </div>
            </div>
          </div>`}).join("")}async function D(){const e=document.getElementById("tournaments-list");try{const t=await fetch("/api/tournaments");W(await t.json())}catch{e.innerHTML='<p style="color:#94A3B8;font-size:0.9rem;text-align:center;padding:2rem;">Could not load tournaments.</p>'}}function O(){H=!0,document.getElementById("add-tournament-btn").style.display="block",D()}document.addEventListener("mbf:admin-ready",O);document.body.dataset.admin==="true"&&O();window.openTournamentModal=function(e){r=null,l=null,document.getElementById("t-error").style.display="none";const t=document.getElementById("hl-modal-body"),n=document.getElementById("hl-modal-icon");t.style.display="none",n.textContent="▶";const o=document.getElementById("modal-title"),i=document.getElementById("t-id"),a=document.getElementById("t-name"),g=document.getElementById("t-link"),p=document.getElementById("t-status");if(e){o.textContent="Edit Tournament",i.value=e.id,a.value=e.name,g.value=e.link||"",p.value=e.status,r=null,l=null;const s=U(e.dates||"");if(s.start)r=s.start,l=s.end,u=r.getFullYear(),d=r.getMonth();else{const x=new Date;u=x.getFullYear(),d=x.getMonth()}F();const c=e.helpfulLinks||{};w("hotels",c.hotels||[]),w("carRentals",c.carRentals||[]),w("restaurants",c.restaurants||[]),(c.hotels||[]).length+(c.carRentals||[]).length+(c.restaurants||[]).length>0&&(t.style.display="flex",n.textContent="▼")}else{o.textContent="Add Tournament",i.value="",a.value="",g.value="",p.value="upcoming",r=null,l=null;const s=new Date;u=s.getFullYear(),d=s.getMonth(),F(),w("hotels",[]),w("carRentals",[]),w("restaurants",[])}document.getElementById("tournament-modal").style.display="flex",a.focus()};window.closeTournamentModal=function(){document.getElementById("tournament-modal").style.display="none",document.getElementById("date-picker-popup").style.display="none",f=!1};document.getElementById("tournament-modal").addEventListener("click",function(e){e.target===this&&closeTournamentModal()});window.saveTournament=async function(){const e=document.getElementById("t-id").value,t=document.getElementById("t-name").value.trim(),n=document.getElementById("t-dates").value.trim(),o=document.getElementById("t-link").value.trim(),i=document.getElementById("t-status").value,a=document.getElementById("t-error");if(!t||!n){a.style.display="block";return}a.style.display="none";const g={hotels:I("hotels"),carRentals:I("carRentals"),restaurants:I("restaurants")},p=sessionStorage.getItem("mbf_admin_token");(await fetch("/api/tournaments",{method:e?"PUT":"POST",headers:{"Content-Type":"application/json","X-Admin-Token":p||""},body:JSON.stringify(e?{id:e,name:t,dates:n,link:o,status:i,helpfulLinks:g}:{name:t,dates:n,link:o,status:i,helpfulLinks:g})})).ok&&(closeTournamentModal(),await D())};window.deleteTournament=async function(e){if(!await window.mbfConfirm("This tournament will be permanently removed and cannot be recovered.","Delete Tournament?","Delete","🏸"))return;const n=sessionStorage.getItem("mbf_admin_token");(await fetch(`/api/tournaments?id=${e}`,{method:"DELETE",headers:{"X-Admin-Token":n||""}})).ok&&await D()};D();
