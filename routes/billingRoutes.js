const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middleware/requireLogin');

module.exports = (app) => {

    /* Post payment to Stripe and update user
     * @param: string
     * @param: middleware
     * @param: function
     */
    app.post('/api/stripe', requireLogin, (req, res) => {

        if (!req.user) {
            return res
                .status(401)
                .send( {error: 'you must login '});
        }

        stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: '$5 for 5 credits',
            source: req.body.id,
        })
        .then(() => {
            req.user.credits += 5;
            req.user.save((err, success) => {
                if (err) { return res.send(err)}
                res.send(success);
            });
        });
    });
};