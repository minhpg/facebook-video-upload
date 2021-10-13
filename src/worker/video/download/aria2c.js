const exec = require('child_process').exec;


module.exports = (file,cookies) => {
    return new Promise((resolve, reject) => {
        const cookie = cookies.join('; ')
        const cmd = `aria2c "${file.url}" -o "${file.filename}" --header="Cookie: ${cookie}" --auto-file-renaming=false --continue=true --on-download-complete=exit --log-level=info -s16 -x16 -k 5M`
        exec(cmd, (error) => {
            if (error) {
                reject(error)
            }
            resolve(file.filename);
        });

    })

}
