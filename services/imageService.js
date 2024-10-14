export const getUserImageSrc = imagePath => {
    if(imagePath) {
        return imagePath
    } else {
        return '../assets/images/defaultUser.png';
    }
}