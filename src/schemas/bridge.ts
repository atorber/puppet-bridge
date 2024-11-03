import type { EventEmitter } from 'events'
import type * as PUPPET from 'wechaty-puppet'

export interface BridgeInterface extends EventEmitter {
    login(): Promise<any>
    logout(): Promise<any>
    reconnection(): Promise<any>
    checkOnline(): Promise<any>
    setCallbackHost(host: string): Promise<any>
    setCallback(url:string): Promise<any>
    contactSelfQRCode(): Promise<any>
    loadContactList(): Promise<{
        message: string
        contactList: {
            [k: string]: PUPPET.payloads.Contact
        }
    }>
    loadRoomList(): Promise<{
        message: string
        roomList: {
            [k: string]: PUPPET.payloads.Room
        }
    }>
    messageSendText(wxid: string, text: string): Promise<void>

    messageSendContact(
        wxid: string,
        contactId: string,
    ): Promise<void>

    messageSendUrl(
        wxid: string,
        urlLinkPayload: PUPPET.payloads.UrlLink,
    ): Promise<void>

    messageSendMiniProgram(
        wxid: string,
        miniProgramPayload: PUPPET.payloads.MiniProgram,
    ): Promise<void>

    messageSendLocation(
        wxid: string,
        locationPayload: PUPPET.payloads.Location,
    ): Promise<void | string>

    messageForward(
        wxid: string,
        messageId: string,
        messageType: PUPPET.types.Message,
    ): Promise<void>
}
