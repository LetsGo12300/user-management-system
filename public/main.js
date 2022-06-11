const saveButton = document.getElementById('save-btn');

saveButton.addEventListener('click', () => {
    const urlSplit = window.location.href.split('/');
    const name = document.getElementById('name').value;
    
    fetch('/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            _id: urlSplit[urlSplit.length - 1]
        })
    })
});