const openDialogBtns = document.querySelectorAll('#openDialogMobile, #callback-btn');
const closeDialogBtn = document.getElementById('closeModalButton');
const dialog = document.getElementById('callbackModal');
const formBlock = document.getElementById('callbackFormSection');
const successBlock = document.getElementById('successMessageSection');
const form = document.getElementById('callbackForm');

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