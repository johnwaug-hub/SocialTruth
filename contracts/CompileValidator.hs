{-# LANGUAGE OverloadedStrings #-}

module Main where

import qualified Data.ByteString.Short as SBS
import qualified Data.ByteString.Lazy as LBS
import Codec.Serialise (serialise)
import Cardano.Api
import Cardano.Api.Shelley (PlutusScript (..))
import qualified Plutus.V2.Ledger.Api as Plutus
import Data.Aeson (encode)
import qualified Data.ByteString.Lazy as BL

-- Import your validator module
import SocialTruth (validator, validatorHash, validatorAddress, ValidatorParams(..))

main :: IO ()
main = do
    -- Set validator parameters
    let params = ValidatorParams
            { minSubmissionFee = 10_000000  -- 10 TRUTH tokens
            , minStakeAmount   = 1_000000   -- 1 TRUTH token
            , votingPeriod     = 604800000  -- 7 days in milliseconds
            }
    
    -- Get the validator
    let val = validator params
    let script = Plutus.getValidator val
    
    -- Serialize to CBOR
    let scriptSBS = SBS.toShort . LBS.toStrict $ serialise script
    let plutusScript = PlutusScriptSerialised scriptSBS
    
    -- Write serialized script to file
    case Plutus.defaultCostModelParams of
        Just costModel -> do
            let apiScript = PlutusScript PlutusScriptV2 plutusScript
            writeFileTextEnvelope "socialtruth-validator.plutus" Nothing apiScript >>= \case
                Left err -> print err
                Right () -> putStrLn "Validator written to socialtruth-validator.plutus"
            
            -- Generate script address
            let scriptHash = hashScript (PlutusScript PlutusScriptV2 plutusScript)
            let networkId = Mainnet
            let scriptAddr = makeShelleyAddressInEra
                                networkId
                                (PaymentCredentialByScript scriptHash)
                                NoStakeAddress
            
            putStrLn $ "Validator Address: " ++ show scriptAddr
            putStrLn $ "Script Hash: " ++ show scriptHash
            
        Nothing -> putStrLn "Error: Could not get cost model params"
