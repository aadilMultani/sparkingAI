const TryCatch = require('../middleware/tryCatch');
const otpGenerator = require('otp-generator');
const otpModel = require('../models/otp');
const { PassThrough } = require('stream');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const { SpeechClient } = require('@google-cloud/speech');
const ErrorHandler = require('../utils/errorHandler');

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID, TWILIO_PHONE_NUMBER } = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true,
});

// Initialize Google Speech-to-Text client
const speechClient = new SpeechClient();
// const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.sendOTP = async (phoneNumber) => {
    try {
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });

        const cDate = new Date();
        await otpModel.findOneAndUpdate(
            { phoneNumber },
            { otp, otpExpiration: new Date(cDate.getTime()) },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )

        const otpResponse = await client.verify
            .services(TWILIO_SERVICE_SID)
            .verifications.create({
                to: phoneNumber,
                channel: 'sms',
                from: TWILIO_PHONE_NUMBER
            });
        return {
            status: true,
            message: `Otp Send Successfully!`,
        };
    } catch (error) {
        return {
            status: false,
            message: `Otp Send Failed! : ${error.message}`,
        }
    }
}

exports.verifyOTP = TryCatch(async (req, res, next) => {
    const { countryCode, phoneNumber, otp } = req.body;
    const verifiedOTP = await client.verify
        .services(TWILIO_SERVICE_SID)
        .verificationChecks.create({
            to: `+${countryCode}${phoneNumber}`,
            code: otp
        });
    return res.json({
        status: true,
        message: `Otp Verified Successfully! : ${JSON.stringify(verifiedOTP)}`,
    });
})

exports.createCall = TryCatch(async (req, res, next) => {
    const call = await client.calls.create({
        from: `${TWILIO_PHONE_NUMBER}`,
        to: "+919662896738",
        url: "https://8965-103-240-208-216.ngrok-free.app",
        record: true
    });

    if (!call)
        return next(new ErrorHandler('something want Wrong !', 400));

    const response = new VoiceResponse();
    const say = response.say({
        voice: 'Polly.Joanna'
    }, 'Hi');
    say.break({
        strength: 'x-weak',
        time: '100ms'
    });
    say.emphasis({
        level: 'moderate'
    }, 'Words to emphasize');
    say.p('Words to speak');
    say.addText('aaaaaa')
    say.phoneme({
        alphabet: 'x-sampa',
        ph: 'pɪˈkɑːn'
    }, 'Words to speak');
    say.addText('bbbbbbb')
    say.prosody({
        pitch: '-10%',
        rate: '85%',
        volume: '-6dB'
    }, 'Words to speak');
    say.s('Words to speak');
    say.sayAs({
        'interpret-as': 'spell-out',
        role: 'yyyymmdd'
    }, 'Words to speak');
    say.sub({
        alias: 'alias'
    }, 'Words to be substituted');
    say.w('Words to speak');

    console.log("call >>>", call);
    return res.json({
        status: true,
        message: "call Send Successfully",
    });
});

exports.voiceResponse = TryCatch(async (req, res, next) => {
    res.type('text/xml');
    // const twiml = new VoiceResponse();
    // twiml.say('Hello From your palm at twilio. Have Fun!');

    const response = new VoiceResponse();
    const say = response.say({
        voice: 'Polly.Joanna'
    }, 'Hi');
    say.break({
        strength: 'x-weak',
        time: '100ms'
    });
    say.emphasis({
        level: 'moderate'
    }, 'Words to emphasize');
    say.p('Words to speak');
    say.addText('aaaaaa')
    say.phoneme({
        alphabet: 'x-sampa',
        ph: 'pɪˈkɑːn'
    }, 'Words to speak');
    say.addText('bbbbbbb')
    say.prosody({
        pitch: '-10%',
        rate: '85%',
        volume: '-6dB'
    }, 'Words to speak');
    say.s('Words to speak');
    say.sayAs({
        'interpret-as': 'spell-out',
        role: 'yyyymmdd'
    }, 'Words to speak');
    say.sub({
        alias: 'alias'
    }, 'Words to be substituted');
    say.w('Words to speak');

    response.record();
    res.send(say.toString());
});

exports.Transcribe = TryCatch(async (req, res, next) => {

    const { callSid } = req.body;
    console.log("callSid ????", callSid);
    // Create a new audio stream to capture call audio
    const audioStream = new PassThrough();

    // Define Google Speech-to-Text streaming configuration
    const recognizeStream = speechClient.streamingRecognize({
        config: {
            encoding: "MULAW",
            sampleRateHertz: 8000,
            languageCode: "en-GB"
        },
        interimResults: true,
    }).on('data', (data) => {
        console.log(`Transcript: ${data.results[0]?.alternatives[0]?.transcript}`);
    });

    // const recording = await client.recordings.list({ callSid: callSid, limit: 1 });
    // console.log("recording >>>", recording)
    console.log("recognizeStream >>.", recognizeStream);

    // Stream call audio to Google Speech-to-Text
    audioStream.pipe(recognizeStream);

    // Fetch call recording URL
    const call = await client.calls(callSid).fetch();
    console.log("call >> ", call);
    const recordingUrl = call.subresourceUris.recordings;
    console.log("recordingUrl >> ", recordingUrl);

    client.request({
        method: 'get',
        uri: `https://api.twilio.com${recordingUrl}`,
        encoding: null
    }).then((res) => {
        console.log("res >>", res.body.recordings);
    })

    res.status(200).send('Streaming and transcribing audio...');
})