const deleteButtons = document.querySelectorAll('.delete-btn');
const confirmation = document.querySelector(".confirmation");

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
            removeRow(tr,data);
        })
        .catch(err => {
            console.log(err)
        })

        // Check if table is empty
        let table = document.getElementsByClassName('table')[0];
        if (table.rows.length === 2){
            // Declare no users yet in the database
            setTimeout(() => {
                table.innerHTML = '<div class="text-center">No users yet!</div>';
            }, 1000);
        }
    })
});

document.querySelectorAll('td').forEach(td => {
    td.classList.add('align-middle')
})

document.querySelectorAll('tr').forEach(tr => {
    tr.classList.add('text-center')
})

function removeRow(tr, data){
    tr.classList.add('tr-remove');
    tr.style.animationPlayState = 'running';
    tr.addEventListener('animationend', () => {
        tr.remove();
        displayConfirmationMsg(data)
    })
}

function displayConfirmationMsg(data){
    confirmation.textContent = data.message;
    confirmation.style.display = 'block';
    setTimeout(() => {
        confirmation.style.display = 'none';
    }, 2200);
}