const defaultApi = '/api/students';
let api;
try {
  const origin = location.origin || '';
  if (origin.startsWith('http://127.0.0.1:5500') || origin.startsWith('http://localhost:5500')) {
    api = 'http://127.0.0.1:3000/api/students';
  } else {
    api = defaultApi;
  }
} catch (e) {
  api = defaultApi;
}

async function fetchStudents(){
  const res = await fetch(api);
  const data = await res.json();
  const list = document.getElementById('studentsList');
  list.innerHTML = '';
  data.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${escapeHtml(s.name)}</strong> <div class="meta">${s.age||''} ${s.grade?'- '+s.grade:''} ${s.email?'- '+s.email:''}</div></div>
      <div><button class="del" data-id="${s._id}">Delete</button></div>`;
    list.appendChild(li);
  });
}

function escapeHtml(str){
  if(!str) return '';
  return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

document.getElementById('studentForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value;
  const grade = document.getElementById('grade').value.trim();
  const email = document.getElementById('email').value.trim();
  if(!name) return alert('Name is required');
  await fetch(api, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,age:age?Number(age):undefined,grade,email})});
  e.target.reset();
  fetchStudents();
});

document.getElementById('studentsList').addEventListener('click', async (e)=>{
  if(e.target.matches('.del')){
    const id = e.target.dataset.id;
    if(!confirm('Delete this student?')) return;
    await fetch(`${api}/${id}`,{method:'DELETE'});
    fetchStudents();
  }
});

fetchStudents();
