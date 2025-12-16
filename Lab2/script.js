const openDialogBtns = document.querySelectorAll('#openDialogMobile, #callback-btn');
const closeDialogBtn = document.getElementById('closeDialogBtn');
const dialog = document.getElementById('callDialog');
const formBlock = document.getElementById('formBlock');
const successBlock = document.getElementById('successBlock');
const form = document.getElementById('callForm');

openDialogBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        formBlock.style.display = 'flex';
        successBlock.style.display = 'none';

        dialog.showModal();
        dialog.classList.add('opening'); 
        closeDialogBtn.style.display = 'block';
    });
});

closeDialogBtn.addEventListener('click', () => {
    dialog.classList.remove('opening');

    setTimeout(() => {
        dialog.close();

        form.reset();
        closeDialogBtn.style.display = 'none';
    }, 400);
});

form.addEventListener('submit', (e) => {
     e.preventDefault();
    formBlock.style.display = 'none';
    successBlock.style.display = 'flex';
});