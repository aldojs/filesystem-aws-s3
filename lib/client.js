
'use strict'

exports.Client = class {
  /**
   * 
   * @param {S3Client} sss 
   */
  constructor (sss) {
    this._client = sss
  }

  read (params) {
    return new Promise((resolve, reject) => {
      this._client.getObject(params, (err, { Body }) => {
        err ? reject(err) : resolve(Body)
      })
    })
  }

  readInfo (params) {
    return new Promise((resolve,reject) => {
      this._client.headObject(params, (err, info) => {
        err ? reject(err) : resolve(info)
      })
    })
  }

  isFile (params) {
    return new Promise((resolve, reject) => {
      this._client.headObject(params, (error) => {
        if (!error) return resolve(true)

        if (error.statusCode === 404) return resolve(false)

        reject(error) // unexpected error
      })
    })
  }

  createReadStream (params) {
    return this._client.getObject(params).createReadStream()
  }

  remove (params) {
    return new Promise((resolve, reject) => {
      this._client.deleteObject(params, (err) => {
        err ? reject(err) : resolve()
      })
    })
  }

  upload (params) {
    return new Promise((resolve, reject) => {
      this._client.upload(params, (err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
  }
}
