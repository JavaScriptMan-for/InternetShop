class MailOptions { 
    constructor(from, to, subject, html) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.html = html
    }
    date = new Date().toUTCString();
    messageId = `<${new Date().getTime()}@mail.ru>`;
    mimeVersion = '1.0';
    contentType = 'text/html; charset=utf-8';
}


module.exports = MailOptions