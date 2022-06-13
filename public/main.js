const deleteButtons = document.querySelectorAll('.delete-btn');

deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', () => {
        let userID = deleteButton.getAttribute('data-id');
        let tr = document.querySelector(`[tr-id='${userID}']`);

        fetch(`/api/delete/${userID}`,{
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            tr.remove();
            console.log(data.message);
        })
        .catch(err => {
            console.log(err)
        })
    })
});