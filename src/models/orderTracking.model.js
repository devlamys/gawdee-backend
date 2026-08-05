import mongoose, { Schema, model } from 'mongoose';

const orderTrackingSchema = new Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  status: { type: Schema.Types.ObjectId, ref: 'ShippingStatus'}
});

const OrderTracking = model('OrderTracking', orderTrackingSchema);

export default OrderTracking;
