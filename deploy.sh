#!/bin/bash

# Sync the local directory with the S3 bucket
aws s3 sync . s3://womens-hair-ai-ivy/