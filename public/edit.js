const saveButton = document.getElementById('save-btn');

saveButton.addEventListener('click', () => {
    const urlSplit = window.location.href.split('/');
    const name = document.getElementById('name').value;
    
    fetch(`/api/update/${urlSplit[urlSplit.length - 1]}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name
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