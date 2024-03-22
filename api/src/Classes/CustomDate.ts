class CustomDate extends Date {
	resetDay() {
		this.setHours(0);
		this.setMinutes(0);
		this.setSeconds(0);
		this.setMilliseconds(0);

		return this;
	}
}

export default CustomDate;