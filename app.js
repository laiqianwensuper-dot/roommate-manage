(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const KEY = 'roomie-home-v3';
  const defaults = { homeName: '梧桐小屋', nickname: '小满', choreDone: false, pactAgreed: false, detergentClaimed: false, detergentRestocked: false, memories: [], pacts: [], supplies: [], schedule: ['小满', '阿哲', '七喜', 'Evan', '小满', '阿哲', '七喜'] };
  const state = { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  if (!Array.isArray(state.schedule) || state.schedule.length !== 7) state.schedule = [...defaults.schedule];
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  const esc = (s = '') => s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const toastBox = $('#toast'); let timer;
  const toast = (message) => { toastBox.textContent = message; toastBox.classList.add('show'); clearTimeout(timer); timer = setTimeout(() => toastBox.classList.remove('show'), 2600); };
  const backdrop = $('.backdrop');
  const closeSheets = () => { $$('.sheet').forEach(x => x.classList.add('hidden')); backdrop.classList.add('hidden'); };
  const openSheet = (id) => { $('#homeMenu').classList.add('hidden'); closeSheets(); $(`#${id}`).classList.remove('hidden'); backdrop.classList.remove('hidden'); };
  const addActivity = (initial, name, text) => { const item = document.createElement('article'); item.innerHTML = `<span class="person coral">${initial}</span><div><b>${esc(text)}</b><small>刚刚</small></div>`; $('#activityList').prepend(item); };

  function localize() {
    $('.activity').id = 'activityList';
    const words = { "TODAY'S CHORE": '今日值日', 'FOR YOU': '轮到你处理', 'AT HOME': '小屋动态', 'LITTLE MOMENTS': '小屋时光', 'CLEAN TOGETHER': '一起照顾小家', 'THIS WEEK': '本周安排', 'SHARED ITEMS': '公共物品', 'AGREEMENTS': '共同确认', 'SPLIT A COST': '临时共同开销', 'INVITE ROOMMATES': '邀请室友', 'NEW AGREEMENT': '发起约定', 'RESTOCKED': '补货完成' };
    $$('.eyebrow').forEach(el => { if (words[el.textContent.trim()]) el.textContent = words[el.textContent.trim()]; });
    $('#activityList').closest('.section').querySelector('h2').textContent = '小屋动态';
    $$('.chip').find(el => el.textContent.trim() === '自动轮班')?.remove();
    const head = $('.schedule').closest('.section').querySelector('.section-head');
    const edit = document.createElement('button'); edit.className = 'edit-schedule'; edit.id = 'editSchedule'; edit.textContent = '编辑排班'; head.append(edit);
    $('#fillRotation')?.remove();
    const form = $('#scheduleEditor .schedule-form');
    ['周五', '周六', '周日'].forEach((day, index) => { const label = document.createElement('label'); const select = document.createElement('select'); select.id = `schedule${index + 4}`; ['小满', '阿哲', '七喜', 'Evan'].forEach(name => { const option = document.createElement('option'); option.textContent = name; select.append(option); }); label.append(day, select); form.append(label); });
  }

  function renderHomeName() {
    $('#topHomeName').textContent = state.homeName;
    $('#menuHomeName').textContent = state.homeName;
    $('#homePageName').textContent = state.homeName;
    $('.home-logo').textContent = state.homeName.slice(0, 1);
    $('.profile').textContent = state.nickname.slice(0, 1);
    $('.intro h1').innerHTML = `早上好，${esc(state.nickname)} ☀️`;
    $('#homeMeta').textContent = state.homeName === '梧桐小屋' ? '一起住的第 128 天 · 4 位室友' : `由 ${state.nickname} 创建 · 等待室友加入`;
  }
  function renderChore() {
    if (!state.choreDone) return;
    $('#choreHero').classList.add('complete');
    ['#finishChore', '#finishChore2'].forEach(id => { const b = $(id); b.textContent = '✓ 今天完成啦'; b.disabled = true; });
  }
  function renderPact() {
    if (!state.pactAgreed) return;
    $('#pactCount').textContent = '4 / 4 已确认';
    const button = $('#agreePact');
    if (button) button.replaceWith(Object.assign(document.createElement('em'), { className: 'ok', textContent: '已生效' }));
    $('#pactTodo')?.remove(); $('#todoCount').textContent = state.detergentClaimed ? '0' : '1';
  }
  function renderSupply() {
    const buttons = $$('.claim');
    if (!state.detergentClaimed) return;
    buttons.forEach(b => { b.textContent = state.detergentRestocked ? '✓ 已补好' : '✓ 你已认领'; b.dataset.claimed = 'true'; });
    const supply = $('#detergent');
    supply.dataset.status = 'claimed';
    supply.querySelector('small').textContent = state.detergentRestocked ? '小满 · 已补好' : '小满 · 等你补货';
    supply.querySelector('em').textContent = state.detergentRestocked ? '已补好' : '我已认领';
    const todo = $('#todoList .todo:first-child');
    if (todo) { todo.querySelector('small').textContent = state.detergentRestocked ? '小满已经补好啦' : '你已认领，等买到后确认'; todo.querySelector('button').textContent = state.detergentRestocked ? '已补好' : '去确认'; }
  }
  function renderMemories() { state.memories.forEach(memory => { const card = document.createElement('article'); card.className = `photo-card ${memory.cover ? 'photo-movie' : 'photo-dumpling'}`; card.innerHTML = `<span>刚刚</span><div><b>${esc(memory.title)}</b><small>${esc(state.nickname)}</small></div>`; $('#memories').prepend(card); }); }
  function renderPacts() { state.pacts.forEach(text => { const item = document.createElement('article'); item.innerHTML = `<span>🤝</span><div><b>${esc(text)}</b><small>1 / 4 已确认</small></div><em>待确认</em>`; $('#pacts').append(item); }); }
  function renderSupplies() { state.supplies.forEach(item => { const card = document.createElement('article'); card.className = 'supply'; card.dataset.status = 'ok'; card.innerHTML = `<div><span>📦</span><em class="ok">已登记</em></div><h3>${esc(item.name)}</h3><p>${esc(item.amount)}</p><i class="bar good"><b style="width:65%"></b></i><small>刚刚添加</small><button disabled>库存正常</button>`; $('.supply-grid').prepend(card); }); }
  function renderSchedule() { const style = {小满:['满','coral'],阿哲:['哲','sage'],七喜:['七','yellow'],Evan:['E','pink']}; const days = [['周一','9/14'],['周二','9/15'],['周三','9/16'],['周四','9/17'],['周五','9/18'],['周六','9/19'],['周日','9/20']]; $('.schedule').innerHTML = days.map(([day,date],i) => { const [initial,color] = style[state.schedule[i]]; return `<article class="${i === 0 ? 'now' : ''}"><span>${day}<small>${date}</small></span><i class="person ${color}">${initial}</i><b>${state.schedule[i]}</b>${i === 0 ? '<em>今天</em>' : '<em></em>'}</article>`; }).join(''); }

  localize(); renderHomeName(); renderChore(); renderPact(); renderSupply(); renderMemories(); renderPacts(); renderSupplies(); renderSchedule();
  $$('.supply').forEach((card, i) => { if (!card.dataset.status) card.dataset.status = ['claimed', 'low', 'ok', 'ok'][i]; });
  $('#homeSwitch').addEventListener('click', () => $('#homeMenu').classList.toggle('hidden'));
  $$('[data-modal]').forEach(b => b.addEventListener('click', () => openSheet(b.dataset.modal)));
  $$('.close').forEach(b => b.addEventListener('click', closeSheets)); backdrop.addEventListener('click', closeSheets);
  function showPage(id) { $$('.page').forEach(p => p.classList.toggle('active', p.id === id)); $$('.nav button').forEach(b => b.classList.toggle('active', b.dataset.page === id)); window.scrollTo({top:0, behavior:'smooth'}); }
  $$('.nav button').forEach(b => b.addEventListener('click', () => showPage(b.dataset.page)));
  $$('[data-jump]').forEach(b => b.addEventListener('click', () => showPage(b.dataset.jump)));
  $('#editSchedule').addEventListener('click', () => { state.schedule.forEach((name, i) => { $(`#schedule${i}`).value = name; }); openSheet('scheduleEditor'); });
  $('#saveSchedule').addEventListener('click', () => { state.schedule = [0, 1, 2, 3, 4, 5, 6].map(i => $(`#schedule${i}`).value); save(); renderSchedule(); closeSheets(); toast('本周值日已安排好'); });

  function completeChore() { if (state.choreDone) return toast('今天的值日已经完成啦'); state.choreDone = true; save(); renderChore(); addActivity('满', state.nickname, `${state.nickname}完成了今天的值日`); toast('辛苦啦，小屋又干净了一点 ✨'); }
  $('#finishChore').addEventListener('click', completeChore); $('#finishChore2').addEventListener('click', completeChore);
  let swapPerson = '阿哲';
  $('#swapChore').addEventListener('click', () => openSheet('swap'));
  $$('#swapOptions .swap-option').forEach(option => option.addEventListener('click', () => { $$('#swapOptions .swap-option').forEach(x => x.classList.remove('selected')); option.classList.add('selected'); swapPerson = option.dataset.person; $('#sendSwap').textContent = `向${swapPerson}发起换班`; }));
  $('#sendSwap').addEventListener('click', () => { closeSheets(); toast(`已向${swapPerson}发起换班请求`); });
  function claimDetergent() { if (state.detergentRestocked) return toast('洗衣液已经补好了'); if (!state.detergentClaimed) { state.detergentClaimed = true; save(); renderSupply(); addActivity('满', state.nickname, `${state.nickname}认领了洗衣液补货`); toast('已告诉室友：你会负责补货'); return; } openSheet('replenish'); }
  $$('.claim').forEach(b => b.addEventListener('click', claimDetergent));
  $('#confirmReplenish').addEventListener('click', () => { state.detergentRestocked = true; save(); renderSupply(); closeSheets(); addActivity('满', state.nickname, `${state.nickname}补好了洗衣液`); toast('太好了，小屋物品已经补好'); });
  $('#addFromSupply').addEventListener('click', () => { closeSheets(); $('#expenseName').value = '洗衣液'; $('#expenseAmount').value = '39.90'; updateSplit(); openSheet('expense'); });
  function agreePact() { if (state.pactAgreed) return; state.pactAgreed = true; save(); renderPact(); addActivity('满', state.nickname, `${state.nickname}确认了小屋约定`); toast('已确认这条小屋约定'); }
  $('#agreePact')?.addEventListener('click', agreePact); $('#quickAgree')?.addEventListener('click', agreePact);
  function updateSplit() { const n = Number($('#expenseAmount').value) || 0, members = $$('.checks input:checked').length || 1; $('#splitPreview').textContent = `平均分摊 · ${members} 人，每人 ¥${(n / members).toFixed(2)}`; }
  $('#expenseAmount').addEventListener('input', updateSplit); $$('.checks input').forEach(i => i.addEventListener('change', updateSplit));
  $('#saveExpense').addEventListener('click', () => { const title = $('#expenseName').value.trim() || '共同开销'; closeSheets(); addActivity('满', state.nickname, `${state.nickname}记录了一笔「${title}」`); toast(`已记录「${title}」`); });
  $$('.copy').forEach(b => b.addEventListener('click', async () => { try { await navigator.clipboard.writeText(b.dataset.copy); } catch {} toast('已复制到剪贴板'); }));
  $('#savePact').addEventListener('click', () => { const value = $('#newPact').value.trim(); if (!value) return toast('先写下一条约定吧'); state.pacts.push(value); save(); const item = document.createElement('article'); item.innerHTML = `<span>🤝</span><div><b>${esc(value)}</b><small>1 / 4 已确认</small></div><em>待确认</em>`; $('#pacts').append(item); $('#newPact').value = ''; closeSheets(); toast('已发起，等待室友确认'); });
  let cover = 0; $('#photoPick').addEventListener('click', () => { cover = cover ? 0 : 1; $('#photoPick').firstChild.nodeValue = cover ? '🎬' : '☀️'; });
  $('#saveMemory').addEventListener('click', () => { const title = $('#memoryTitle').value.trim(); if (!title) return toast('给这一刻起个名字吧'); const record = {title, cover}; state.memories.unshift(record); save(); const item = document.createElement('article'); item.className = `photo-card ${cover ? 'photo-movie' : 'photo-dumpling'}`; item.innerHTML = `<span>刚刚</span><div><b>${esc(title)}</b><small>${esc(state.nickname)}</small></div>`; $('#memories').prepend(item); $('#memoryTitle').value = ''; $('#memoryText').value = ''; closeSheets(); toast('这一刻已经留在小屋时光里'); });
  $$('.filters button').forEach(b => b.addEventListener('click', () => { $$('.filters button').forEach(x => x.classList.remove('active')); b.classList.add('active'); const map = {'全部':'all','需要补货':'low','我已认领':'claimed'}; const kind = map[b.textContent]; $$('.supply').forEach(card => card.style.display = kind === 'all' || card.dataset.status === kind ? '' : 'none'); }));
  $('#supplies .round').addEventListener('click', () => openSheet('supplyAdd'));
  $('#saveSupply').addEventListener('click', () => { const name = $('#supplyName').value.trim(), amount = $('#supplyAmount').value.trim(); if (!name || !amount) return toast('请补全物品名称和库存'); const item = {name, amount}; state.supplies.unshift(item); save(); const card = document.createElement('article'); card.className = 'supply'; card.dataset.status = 'ok'; card.innerHTML = `<div><span>📦</span><em class="ok">已登记</em></div><h3>${esc(name)}</h3><p>${esc(amount)}</p><i class="bar good"><b style="width:65%"></b></i><small>刚刚添加</small><button disabled>库存正常</button>`; $('.supply-grid').prepend(card); $('#supplyName').value = ''; $('#supplyAmount').value = ''; closeSheets(); toast(`已添加「${name}」`); });
  $('#createHome').addEventListener('click', () => { const name = $('#createHomeName').value.trim(), nickname = $('#createNickname').value.trim(); if (!name || !nickname) return toast('先填好小家名称和昵称'); Object.assign(state, defaults, {homeName:name,nickname,memories:[],pacts:[]}); save(); renderHomeName(); closeSheets(); showPage('home'); toast(`「${name}」创建成功 🎉`); });
  $('#joinHome').addEventListener('click', () => { const code = $('#joinCode').value.trim().toUpperCase(); if (!code) return toast('请输入邀请码'); state.homeName = code === 'HOME88' ? '梧桐小屋' : '好友的小屋'; state.choreDone = false; save(); renderHomeName(); closeSheets(); showPage('home'); toast(`欢迎加入「${state.homeName}」`); });
})();
