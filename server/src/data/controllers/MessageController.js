const Message = require("../models/Message");

module.exports = class MessageController {
    /**
     *  Veritabanına yeni bir mesaj kaydeder.
     * @param {String} from
     * @param {Date} at
     * @param {String} content
     */
    static createMessage = (from, at, content) => {
        return new Promise((resolve, reject) => {
            const message = new Message({
                from,
                at,
                content,
            });

            message
                .save()
                .then((doc) => resolve(doc))
                .catch((error) => reject(error));
        });
    };
};
