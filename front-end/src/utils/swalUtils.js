import Swal from 'sweetalert2';

export const showConfirmation = async ({ title = "Bạn chắc chắn chứ?", text, confirmButtonText = 'OK', cancelButtonText = 'Hủy' }) => {
    return await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText,
        cancelButtonText,
    });
};

export const showWarning = async ({ title = "Cảnh báo!", text, position = 'center' }) => {
    return await Swal.fire({
        title,
        text,
        icon: 'warning',
        confirmButtonText: 'OK',
        position
    });
};

export const showSuccess = async ({ title = "Thành công!", text, timer = 1000, position = 'center', showConfirmButton = false }) => {
    return await Swal.fire({
        title,
        text,
        timer,
        icon: 'success',
        position,
        showConfirmButton,
    });
};