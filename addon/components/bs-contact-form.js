import Ember from 'ember';
import layout from '../templates/components/bs-contact-form';

export default Ember.Component.extend({
  layout: layout,
	btnText: "Send",
	actions: {
		sendMail: function() {
			let btnText = this.get('btnText');
			let fields = this.get('fields');
			if (this._checkValidation(fields)) {
				let postValues = this._postValues(fields);

				this._postMail(this.get('endpoint'), postValues).then((data) => {
					console.log(data);
					if (data.success) {
						this.set('btnText', 'Message Sent!');
						Ember.run.later( () => {
							this._clearFormValues(fields);
							this.set('btnText', btnText);
						}, 5000);
					} else {
						this.set('btnText', 'Error sending message, try again');
						Ember.run.later( () => {
							this._clearFormValues(fields);
							this.set('btnText', btnText);
						}, 5000);
					}
				});

			}
		}
	},
	_checkValidation(fields) {
		let validates = true;
		fields.forEach((field) => {
			if (field.requires_validation) {
				if (!field.validates) {
					validates = false;
					Ember.set(field, 'error', "'" + field.label + "' cannot be blank");
				}
			}
		});
		return validates;
	},
	_postValues: function(fields) {
		let post_values = {};
		fields.forEach((field) => {
			post_values[field.name] = {
				value: field.value,
				label: field.label
			};
		});
		return post_values;
	},
	_postMail: function(endpoint, postValues) {
		return Ember.$.post(endpoint, postValues);
	},
	_clearFormValues: function(fields) {
		fields.forEach((field) => {
			if (field.clearField) {
				Ember.set(field, 'value', '');
			}
		});
	}
});
