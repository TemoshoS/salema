import { getCoordinates, sendCoordinates } from '../src/geolocation';

// Your tests go hereimport * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { getCoordinates, sendCoordinates } from './yourFile'; // replace with your file path

jest.mock('expo-location');
jest.mock('expo-sms');

describe('getCoordinates', () => {
  it('returns coordinates when permission is granted', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 0, longitude: 0 } });

    const position = await getCoordinates();

    expect(position).toEqual({ coords: { latitude: 0, longitude: 0 } });
  });

  it('throws error when permission is denied', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });

    await expect(getCoordinates()).rejects.toThrow('Permission to access location was denied');
  });
});

describe('sendCoordinates', () => {
  it('sends SMS when SMS service is available', async () => {
    SMS.isAvailableAsync.mockResolvedValue(true);
    SMS.sendSMSAsync.mockResolvedValue({ result: 'sent' });

    const result = await sendCoordinates('1234567890');

    expect(result).toEqual({ result: 'sent' });
  });

  it('throws error when SMS service is not available', async () => {
    SMS.isAvailableAsync.mockResolvedValue(false);

    await expect(sendCoordinates('1234567890')).rejects.toThrow('SMS service not available');
  });
});