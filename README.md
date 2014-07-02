publish-error-example
=====================

Clone and run

From homepage, navigate to /things

server crashes logging out:

    Exception in defer callback: Error: failed to copy newResults into _published!
        at Error (<anonymous>)
        at _.extend._publishNewResults (packages/mongo-livedata/oplog_observe_driver.js:767)
        at _.extend._runQuery (packages/mongo-livedata/oplog_observe_driver.js:650)
        at _.extend._runInitialQuery (packages/mongo-livedata/oplog_observe_driver.js:568)
        at packages/mongo-livedata/oplog_observe_driver.js:164
        at packages/mongo-livedata/oplog_observe_driver.js:16
        at _.extend.withValue (packages/meteor/dynamics_nodejs.js:56)
        at packages/meteor/timers.js:6
        at runWithEnvironment (packages/meteor/dynamics_nodejs.js:108)
        
?
