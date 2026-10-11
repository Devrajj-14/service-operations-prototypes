const $ = id => document.getElementById(id);
const value = id => $(id).value.trim();
const show = (resultId, emptyId) => { $(resultId).hidden = false; $(emptyId).hidden = true; };
const dateText = date => new Intl.DateTimeFormat('en', {dateStyle:'medium',timeStyle:'short'}).format(date);
const status = (id, message, alert) => { $(id).textContent = message; $(id).classList.toggle('alert',alert); };

document.querySelectorAll('.copy').forEach(button => button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($(button.dataset.copy).textContent);
    button.textContent = 'Copied';
    setTimeout(() => button.textContent = button.dataset.copy === 'a-summary' ? 'Copy report' : button.dataset.copy === 'g-summary' ? 'Copy brief' : 'Copy summary', 1800);
  } catch { button.textContent = 'Select the text above to copy'; }
}));

if (document.body.dataset.demo === 'helperji') {
  $('helperji-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const service = value('h-service'), city = value('h-city'), when = value('h-when');
    $('h-route').textContent = `${service} · ${city} team`;
    status('h-priority', when === 'Today' ? 'Priority review suggested' : 'Standard enquiry', when === 'Today');
    $('h-summary').textContent = `NEW SERVICE ENQUIRY\nService: ${service}\nCity / locality: ${city}, ${value('h-area')}\nRequested timing: ${when}\nDetails: ${value('h-details')}\nSuggested next step: Confirm coverage, availability and quote with the customer.`;
    show('h-result','h-empty');
  });
}

if (document.body.dataset.demo === 'aventra') {
  $('aventra-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const checks = [...document.querySelectorAll('input[name=check]')];
    const completed = checks.filter(check => check.checked).map(check => check.value);
    const pending = checks.filter(check => !check.checked).map(check => check.value);
    const issue = value('a-issue');
    $('a-score').textContent = `${completed.length}/${checks.length}`;
    status('a-status', issue || pending.length ? 'Manager review suggested' : 'All checks completed', Boolean(issue || pending.length));
    $('a-summary').textContent = `DAILY SITE CHECK · ${new Date().toLocaleDateString('en-GB')}\nSite: ${value('a-site')}\nCompleted (${completed.length}): ${completed.join('; ') || 'None'}\nPending (${pending.length}): ${pending.join('; ') || 'None'}\nIssue: ${issue || 'None recorded'}\nNext step: ${issue || pending.length ? 'Review open items and assign an owner.' : 'Archive after manager review.'}`;
    show('a-result','a-empty');
  });
}

if (document.body.dataset.demo === 'maidtidy') {
  const jobs = [];
  const render = () => {
    $('m-empty').hidden = jobs.length > 0;
    $('m-clear').hidden = jobs.length === 0;
    $('m-board').replaceChildren();
    jobs.forEach((job,index) => {
      const overlaps = jobs.some((other,i) => i !== index && other.property.toLowerCase() === job.property.toLowerCase() && job.out < other.next && other.out < job.next);
      const windowHours = (job.next - job.out) / 3600000;
      const tight = windowHours < job.clean;
      const card = document.createElement('article'); card.className = 'job-card';
      const heading = document.createElement('h3'); heading.textContent = job.property;
      const timing = document.createElement('p'); timing.textContent = `${dateText(job.out)} checkout → ${dateText(job.next)} check-in`;
      const estimate = document.createElement('p'); estimate.textContent = `${windowHours.toFixed(1)}h window · ${job.clean}h estimated clean`;
      const flag = document.createElement('span'); flag.className = `status${overlaps || tight ? ' alert' : ''}`; flag.textContent = overlaps ? 'Overlaps another turnover' : tight ? 'Cleaning window too short' : 'Window available';
      card.append(heading,timing,estimate,flag); $('m-board').append(card);
    });
  };
  $('maidtidy-form').addEventListener('submit', event => {
    event.preventDefault(); if (!event.currentTarget.reportValidity()) return;
    const out = new Date(value('m-out')), next = new Date(value('m-in'));
    if (next <= out) { $('m-in').setCustomValidity('Check-in must be after checkout.'); $('m-in').reportValidity(); $('m-in').setCustomValidity(''); return; }
    jobs.push({property:value('m-property'),out,next,clean:Number(value('m-clean'))}); render(); event.currentTarget.reset();
  });
  $('m-clear').addEventListener('click', () => { jobs.length = 0; render(); });
}

if (document.body.dataset.demo === 'magichelpers') {
  $('magic-form').addEventListener('submit', event => {
    event.preventDefault(); if (!event.currentTarget.reportValidity()) return;
    const out = new Date(value('g-checkout')), next = new Date(value('g-checkin'));
    if (next <= out) { $('g-checkin').setCustomValidity('Check-in must be after checkout.'); $('g-checkin').reportValidity(); $('g-checkin').setCustomValidity(''); return; }
    const hours = (next-out)/3600000;
    status('g-status', hours < 4 ? 'Tight turnover window · review staffing' : 'Handoff ready for review', hours < 4);
    $('g-summary').textContent = `CLEANER HANDOFF\nProperty: ${value('g-property')}\nGuest checkout: ${dateText(out)}\nNext check-in: ${dateText(next)}\nTurnover window: ${hours.toFixed(1)} hours\nAccess: ${value('g-access')}\nRestocking / special tasks: ${value('g-restock') || 'None specified'}\nNext step: Confirm team assignment and completion time.`;
    show('g-result','g-empty');
  });
}

if (document.body.dataset.demo === 'iwfm') {
  $('iwfm-form').addEventListener('submit', event => {
    event.preventDefault(); if (!event.currentTarget.reportValidity()) return;
    const checks = [...document.querySelectorAll('input[name=icheck]')];
    const completed = checks.filter(check => check.checked).map(check => check.value);
    const pending = checks.filter(check => !check.checked).map(check => check.value);
    const issue = value('i-issue');
    $('i-score').textContent = `${completed.length}/${checks.length}`;
    status('i-status', issue || pending.length ? 'Open items need review' : 'All checks complete', Boolean(issue || pending.length));
    $('i-summary').textContent = `IWFM SITE QUALITY CHECK\nSite: ${value('i-site')}\nCity: ${value('i-city')}\nShift: ${value('i-shift')}\nDate: ${new Date().toLocaleDateString('en-GB')}\nCompleted: ${completed.join('; ') || 'None'}\nPending: ${pending.join('; ') || 'None'}\nIssue: ${issue || 'None recorded'}\nSuggested next step: ${issue || pending.length ? 'Supervisor to assign and confirm open items.' : 'Confirm the site report with the client.'}`;
    show('i-result','i-empty');
  });
}

if (document.body.dataset.demo === 'turnoverspecialists') {
  $('ts-form').addEventListener('submit', event => {
    event.preventDefault(); if (!event.currentTarget.reportValidity()) return;
    const tasks = value('ts-tasks').split('\n').map(task => task.trim()).filter(Boolean).slice(0, 12);
    if (!tasks.length) { $('ts-tasks').setCustomValidity('Add at least one task.'); $('ts-tasks').reportValidity(); $('ts-tasks').setCustomValidity(''); return; }
    const list = $('ts-checklist'); list.replaceChildren();
    tasks.forEach((task, index) => {
      const label = document.createElement('label'); label.className = 'check';
      const input = document.createElement('input'); input.type = 'checkbox'; input.value = task; input.id = `ts-task-${index}`;
      input.addEventListener('change', render);
      label.append(input, document.createTextNode(task)); list.append(label);
    });
    show('ts-result','ts-empty'); render();
  });
  function render() {
    const all = [...$('ts-checklist').querySelectorAll('input')];
    const done = all.filter(item => item.checked).map(item => item.value);
    const open = all.filter(item => !item.checked).map(item => item.value);
    status('ts-status', open.length ? `${open.length} tasks still open` : 'All tasks complete · ready for review', Boolean(open.length));
    $('ts-summary').textContent = `TURNOVER CHECKLIST\nProperty: ${value('ts-property')}\nDate: ${value('ts-window')}\nCompleted (${done.length}): ${done.join('; ') || 'None'}\nOpen (${open.length}): ${open.join('; ') || 'None'}\nNext step: ${open.length ? 'Complete or hand off remaining tasks.' : 'Confirm property is guest-ready.'}`;
  }
}

if (document.body.dataset.demo === 'pristine') {
  $('p-form').addEventListener('submit', event => {
    event.preventDefault(); if (!event.currentTarget.reportValidity()) return;
    const oneTime = value('p-frequency') === 'One-time';
    status('p-status', 'Ready for site and pricing review', false);
    $('p-summary').textContent = `FACILITY SERVICE ENQUIRY\nSite: ${value('p-site')}\nLocation: ${value('p-city')}\nSite type: ${value('p-type')}\nService: ${value('p-service')}\nApproximate area: ${Number(value('p-size')).toLocaleString('en-IN')} sq ft\nFrequency: ${value('p-frequency')}\nConstraints: ${value('p-notes') || 'None stated'}\nQuestions before estimating: ${oneTime ? 'Confirm site condition, access, preferred date and exact scope.' : 'Confirm service hours, staffing, supplies and contract term.'}`;
    show('p-result','p-empty');
  });
}
