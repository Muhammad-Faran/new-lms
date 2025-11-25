import { ElMessage } from 'element-plus'

export const showMessageAlert = ({ message = '', type = 'success' }) => {
    ElMessage({
        showClose: true,
        message: message,
        type: type,
    })
}