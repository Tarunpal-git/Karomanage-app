package com.calllogsapp

import android.database.Cursor
import android.provider.CallLog
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import java.text.SimpleDateFormat
import java.util.*

class CallLogModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "CallLog"
    }

    @ReactMethod
    fun getCallLogs(limit: Int, promise: Promise) {
        val callLogs: WritableArray = Arguments.createArray()
        val cursor: Cursor? = reactApplicationContext.contentResolver.query(
            CallLog.Calls.CONTENT_URI,
            null,
            null,
            null,
            "${CallLog.Calls.DATE} DESC"
        )
        cursor?.use {
            val numberIndex = it.getColumnIndex(CallLog.Calls.NUMBER)
            val typeIndex = it.getColumnIndex(CallLog.Calls.TYPE)
            val dateIndex = it.getColumnIndex(CallLog.Calls.DATE)
            val durationIndex = it.getColumnIndex(CallLog.Calls.DURATION)
            val accountIdIndex = it.getColumnIndex(CallLog.Calls.PHONE_ACCOUNT_ID)  // Add this line

            var count = 0
            while (it.moveToNext() && count < limit) {
                val phoneNumber = it.getString(numberIndex)
                val callType = it.getInt(typeIndex)
                val callDateMillis = it.getLong(dateIndex)
                val callDurationSeconds = it.getLong(durationIndex)
                val simNumber = it.getString(accountIdIndex)  // Add this line

                val formattedDate = formatDate(callDateMillis)
                val formattedDuration = formatDuration(callDurationSeconds)
                val callTypeString = getCallTypeString(callType)

                val callLog = Arguments.createMap().apply {
                    putString("phoneNumber", phoneNumber)
                    putString("callType", callTypeString)
                    putString("callDate", formattedDate)
                    putString("callDuration", formattedDuration)
                    putString("simNumber", simNumber)  // Add this line
                    putDouble("callDateMillis", callDateMillis.toDouble()) // Add this line
                }
                callLogs.pushMap(callLog)
                count++
            }
        }
        promise.resolve(callLogs)
    }

    private fun formatDate(milliseconds: Long): String {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        val date = Date(milliseconds)
        return dateFormat.format(date)
    }

    private fun formatDuration(seconds: Long): String {
        val hours = seconds / 3600
        val minutes = (seconds % 3600) / 60
        val remainingSeconds = seconds % 60
        return String.format("%02d:%02d:%02d", hours, minutes, remainingSeconds)
    }

    private fun getCallTypeString(type: Int): String {
        return when (type) {
            CallLog.Calls.INCOMING_TYPE -> "Incoming"
            CallLog.Calls.OUTGOING_TYPE -> "Outgoing"
            CallLog.Calls.MISSED_TYPE -> "Missed"
            CallLog.Calls.VOICEMAIL_TYPE -> "Voicemail"
            CallLog.Calls.REJECTED_TYPE -> "Rejected"
            CallLog.Calls.BLOCKED_TYPE -> "Blocked"
            CallLog.Calls.ANSWERED_EXTERNALLY_TYPE -> "Answered Externally"
            else -> "Unknown"
        }
    }
}
