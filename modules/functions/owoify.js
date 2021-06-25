const faces = ["(・`ω´・)", ";;w;;", "owo", "UwU", ">w<", "^w^"];

module.exports = string => {
    string = string.replace(/(?:r|l)/g, "w");
    string = string.replace(/(?:R|L)/g, "W");
    string = string.replace(/n([aeiou])/g, 'ny$1');
    string = string.replace(/N([aeiou])/g, 'Ny$1');
    string = string.replace(/N([AEIOU])/g, 'Ny$1');
    string = string.replace(/ove/g, "uv");
    string = string.replace(/\!+/g, " " + faces[Math.floor(Math.random() * faces.length)] + " ");
    return string;
};