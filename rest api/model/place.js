var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/clinicDb');
// create instance of Schema
var mongoSchema =   mongoose.Schema;

var dentalSchema = new mongoSchema({
    name : String,
    place_id : String,
    formatted_address : String,
    formatted_phone_number : String,
    geometry : {
	    type: { 
	      type: String,
	      default: 'Point'
	    }, 
	    coordinates: [Number]
  	}
});

dentalSchema.index({ geometry:'2dsphere' });

module.exports = mongoose.model('dental',dentalSchema);
