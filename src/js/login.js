function login(){
    var custEmail= document.getElementById("email");
    var custPassword= document.getElementById("password");

    var secretString = "chandini"

    encrypt(new Buffer(custPassword,'utf-8')).then(decrypt).then(plaintext => {
        window.alert(plaintext.toString('utf-8'));
    });

    //localStorage.setItem("email", custEmail.value);
    //localStorage.setItem("password", custPassword.value);

    //window.alert(localStorage.getItem("email"));
    //localStorage.setItem("password", custPassword.value);
    //window.alert(localStorage.getItem("password"));

    console.log(secretString);
   }

   function encrypt(buffer) {
    const kms = new aws.KMS({
        accessKeyId: 'd0b5597a-1867-4d08-93c1-39d871345303', //credentials for your IAM user
        secretAccessKey: '9RKaAxn3/hUebB90DsElTtCBVyZWEcsZr2TZW1CZ', //credentials for your IAM user
        region: 'oregon'
    });
    return new Promise((resolve, reject) => {
        const params = {
            KeyId: 'd0b5597a-1867-4d08-93c1-39d871345303', // The identifier of the CMK to use for encryption. You can use the key ID or Amazon Resource Name (ARN) of the CMK, or the name or ARN of an alias that refers to the CMK.
            Plaintext: buffer// The data to encrypt.
        };
        kms.encrypt(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.CiphertextBlob);
            }
        });
    });
}

function decrypt(buffer) {
    const kms = new aws.KMS({
        accessKeyId: 'd0b5597a-1867-4d08-93c1-39d871345303',
        secretAccessKey: '9RKaAxn3/hUebB90DsElTtCBVyZWEcsZr2TZW1CZ',
        region: 'oregon'
    });
    return new Promise((resolve, reject) => {
        const params = {
            CiphertextBlob: buffer// The data to dencrypt.
        };
        kms.decrypt(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Plaintext);
            }
        });
    });
}