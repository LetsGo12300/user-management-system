const saveButton = document.getElementById('save-btn');

saveButton.addEventListener('click', () => {
    const urlSplit = window.location.href.split('/');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const status = document.querySelector("input[type='radio'][name='status']:checked").value;

    
    fetch(`/api/update/${urlSplit[urlSplit.length - 1]}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            email,
            role,
            status
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(err => {
        console.log(err)
    })
});

