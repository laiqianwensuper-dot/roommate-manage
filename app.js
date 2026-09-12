const backdrop = document.getElementById('modalBackdrop');
const toast = document.getElementById('toast');
const spaceMenu = document.getElementById('spaceMenu');
const switcher = document.getElementById('spaceSwitcher');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2200);
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  backdrop.classList.remove('hidden');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  spaceMenu.classList.add('hidden');
}

function closeModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  backdrop.classList.add('hidden');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(el.dataset.open);
  });
});

document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModals));
backdrop.addEventListener('click', closeModals);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });

switcher.addEventListener('click', (e) => {
  e.stopPropagation();
  spaceMenu.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!spaceMenu.contains(e.target) && !switcher.contains(e.target)) spaceMenu.classList.add('hidden');
});

const expenseAmount = document.getElementById('expenseAmount');
const splitMembers = [...document.querySelectorAll('.splitMember')];
const splitPreview = document.getElementById('splitPreview');

function updateSplitPreview() {
  const count = splitMembers.filter(c => c.checked).length || 1;
  const amount = Number(expenseAmount.value || 0);
  splitPreview.textContent = `${count} 人参与，每人 ¥${(amount / count).toFixed(2)}`;
}
expenseAmount.addEventListener('input', updateSplitPreview);
splitMembers.forEach(c => c.addEventListener('change', updateSplitPreview));

document.getElementById('saveExpense').addEventListener('click', () => {
  const amount = Number(expenseAmount.value || 0);
  const old = 286;
  document.getElementById('billMetric').textContent = `¥${(old + amount).toFixed(2)}`;
  prependActivity('💰', '你', `新增了一笔 ¥${amount.toFixed(0)} 的${document.getElementById('expenseName').value || '合租费用'}`, '刚刚');
  closeModals();
  showToast('已加入小屋账单');
});

document.getElementById('completeChore').addEventListener('click', (e) => {
  e.target.textContent = '✓ 今天完成啦';
  e.target.disabled = true;
  e.target.style.opacity = '.75';
  prependActivity('🧹', '小满', '完成了今日值日', '刚刚');
  showToast('辛苦啦，小屋又干净了一点 ✨');
});

document.querySelectorAll('.claim-btn:not(.subtle)').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.textContent = '✓ 已认领';
    btn.classList.add('subtle');
    btn.disabled = true;
    showToast('已告诉室友你会负责补货');
  });
});

document.querySelectorAll('.agree-btn:not(.done)').forEach(btn => {
  btn.addEventListener('click', () => {
    const count = btn.parentElement.querySelector('.pact-count');
    count.textContent = '4 / 4 已确认';
    btn.textContent = '已同意';
    btn.classList.add('done');
    btn.disabled = true;
    showToast('你已确认这条小屋约定');
  });
});

document.getElementById('addPact').addEventListener('click', () => {
  const input = document.getElementById('newPactInput');
  const text = input.value.trim();
  if (!text) { showToast('先写下一条想约定的小事吧'); return; }
  const item = document.createElement('div');
  item.className = 'pact-item';
  item.innerHTML = `<div><strong>💬 ${escapeHtml(text)}</strong><span class="pact-count">1 / 4 已确认</span></div><button class="agree-btn done">已发起</button>`;
  document.getElementById('pactList').prepend(item);
  input.value = '';
  prependActivity('🤝', '你', '发起了一条新的小屋约定', '刚刚');
  showToast('已发起新约定，等待室友确认');
});

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); } catch (_) {}
    showToast('已复制，可以发给室友啦');
  });
});

document.getElementById('createSpace').addEventListener('click', () => {
  const input = document.getElementById('newSpaceName');
  const name = input.value.trim() || '新小家';
  document.getElementById('spaceNameTop').textContent = name;
  closeModals();
  showToast(`${name} 创建成功 🎉`);
});

document.getElementById('joinSpace').addEventListener('click', () => {
  const code = document.getElementById('joinCode').value.trim();
  if (!code) { showToast('请输入邀请码'); return; }
  closeModals();
  showToast('已加入合租空间');
});

function prependActivity(icon, who, action, time) {
  const item = document.createElement('div');
  item.className = 'activity-item';
  item.innerHTML = `<div class="activity-icon">${icon}</div><div><strong>${escapeHtml(who)}</strong> ${escapeHtml(action)}<div class="time">${escapeHtml(time)}</div></div>`;
  document.getElementById('activityList').prepend(item);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
