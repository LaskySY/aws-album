import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import MicrophoneStream from "microphone-stream";

const REGION = process.env.REACT_APP_AWS_REGION;
const IDENTITY_POOL_ID = process.env.REACT_APP_CONGNITO_IDENTITY_POOL_ID; // An Amazon Cognito Identity Pool ID.

// Create an Amazon Transcribe service client object.
export const transcribeClient = new TranscribeStreamingClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: REGION }),
        identityPoolId: IDENTITY_POOL_ID,
    }),
});

export const pcmEncodeChunk = (chunk) => {
    const input = MicrophoneStream.toRaw(chunk);
    var offset = 0;
    var buffer = new ArrayBuffer(input.length * 2);
    var view = new DataView(buffer);
    for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return Buffer.from(buffer);
};