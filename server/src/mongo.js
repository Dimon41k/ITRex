const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


const collections = {
  mail: mongoose.model('Mail', { email: String, subject: String, body: String, date: { type: Date, default: Date.now },}),
  user: mongoose.model("User", {email:{type:String, unique:true}, password:String, date:{type: Date, default: Date.now}})
}
export default collections;
