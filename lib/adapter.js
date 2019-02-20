
'use strict'

const { Client } = require('./client')


exports.S3Adapter = class {
  /**
   * 
   * @param {S3Client} sss 
   * @param {string} bucket 
   */
  constructor (sss, bucket) {
    this._client = new Client(sss)
    this._bucket = bucket
  }

  /**
   * Read a file's content.
   * 
   * @param {string} filename 
   * @param {Object} [options] 
   * @public
   * @async
   */
  read (filename, options) {
    return this._client.read(this._parameterize(filename, null, options))
  }

  /**
   * Read a file's metadata
   * 
   * @param {string} filename 
   * @param {Object} [options] 
   * @public
   * @async
   */
  readInfo (filename, options) {
    let params = this._parameterize(filename, null, options)

    return this._client.readInfo(params).then(this._normalize)
  }

  /**
   * Determine if a file exists.
   * 
   * @param {string} filename 
   * @param {Object} [options] 
   * @public
   * @async
   */
  exists (filename, options) {
    return this._client.isFile(this._parameterize(filename, null, options))
  }

  /**
   * Create a readable of the file contents.
   * 
   * @param {string} filename 
   * @param {Object} [options] 
   * @public
   * @async
   */
  createReadStream (filename, options) {
    return this._client.createReadStream(this._parameterize(filename, null, options))
  }

  /**
   * Remove a file.
   * 
   * @param {string} filename 
   * @param {Object} [options] 
   * @public
   * @async
   */
  remove (filename, options) {
    return this._client.remove(this._parameterize(filename, null, options))
  }

  /**
   * Write the contents of a file.
   * 
   * Will fail if the file is already exist, unless `overwrite` option is set to `true`.
   * 
   * @param {string} filename 
   * @param {string | Buffer | Stream} content 
   * @param {Object} options 
   * @public
   * @async
   */
  async write (filename, content, { overwrite, ...options } = {}) {
    let params = this._parameterize(filename, content, options)

    if (! overwrite) {
      let exists = await this._client.isFile(params)

      if (exists) throw new Error(`The file "${filename}" already exist.`)
    }

    return this._client.upload(params).then(this._normalize)
  }

  /**
   * Format the S3 parameters.
   * 
   * @param {string} filename 
   * @param {any} [content] 
   * @param {Object} [options] 
   */
  _parameterize (filename, content, options = {}) {
    if (! content) return { Bucket: this._bucket, Key: filename, ...options }

    return { Bucket: this._bucket, Key: filename, Body: content, ...options }
  }

  /**
   * Normalize the file metadata.
   * 
   * @param {Object} info 
   * @private
   */
  _normalize (info) {
    info.modified = info.LastModified.getTime()
    info.mimeType = info.ContentType
    info.size = info.ContentLength

    return info
  }
}
