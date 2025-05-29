# Spark-Pinecone connector

Use the [`spark-pinecone` connector](https://github.com/pinecone-io/spark-pinecone/) to efficiently create, ingest, and update [vector embeddings](https://www.pinecone.io/learn/vector-embeddings/) at scale with [Databricks and Pinecone](/integrations/databricks).

## Install the Spark-Pinecone connector

<Tabs>
  <Tab title="Databricks platform">
    1. [Install the Spark-Pinecone connector as a library](https://docs.databricks.com/en/libraries/cluster-libraries.html#install-a-library-on-a-cluster).
    2. Configure the library as follows:
       1. Select **File path/S3** as the **Library Source**.

       2. Enter the S3 URI for the Pinecone assembly JAR file:

          ```
          s3://pinecone-jars/1.1.0/spark-pinecone-uberjar.jar  
          ```

          <Note>
            Databricks platform users must use the Pinecone assembly jar listed above to ensure that the proper dependecies are installed.
          </Note>

       3. Click **Install**.
  </Tab>

  <Tab title="Databricks on AWS">
    1. [Install the Spark-Pinecone connector as a library](https://docs.databricks.com/en/libraries/cluster-libraries.html#install-a-library-on-a-cluster).
    2. Configure the library as follows:
       1. Select **File path/S3** as the **Library Source**.

       2. Enter the S3 URI for the Pinecone assembly JAR file:

          ```
          s3://pinecone-jars/1.1.0/spark-pinecone-uberjar.jar  
          ```

       3. Click **Install**.
  </Tab>

  <Tab title="Databricks on GCP / Azure">
    1. [Install the Spark-Pinecone connector as a library](https://docs.databricks.com/en/libraries/cluster-libraries.html#install-a-library-on-a-cluster).
    2. Configure the library as follows:
       1. [Download the Pinecone assembly JAR file](https://repo1.maven.org/maven2/io/pinecone/spark-pinecone_2.12/1.1.0/).
       2. Select **Workspace** as the **Library Source**.
       3. Upload the JAR file.
       4. Click **Install**.
  </Tab>
</Tabs>

## Batch upsert

To batch upsert embeddings to Pinecone:

<CodeGroup>
  ```python Python
  from pyspark import SparkConf
  from pyspark.sql import SparkSession
  from pyspark.sql.types import StructType, StructField, ArrayType, FloatType, StringType, LongType

  # Your API key and index name
  api_key = "PINECONE_API_KEY"
  index_name = "PINECONE_INDEX_NAME"
  source_tag = "PINECONE_SOURCE_TAG"

  COMMON_SCHEMA = StructType([
      StructField("id", StringType(), False),
      StructField("namespace", StringType(), True),
      StructField("values", ArrayType(FloatType(), False), False),
      StructField("metadata", StringType(), True),
      StructField("sparse_values", StructType([
          StructField("indices", ArrayType(LongType(), False), False),
          StructField("values", ArrayType(FloatType(), False), False)
      ]), True)
  ])

  # Initialize Spark
  spark = SparkSession.builder.getOrCreate()

  # Read the file and apply the schema
  df = spark.read \
      .option("multiLine", value = True) \
      .option("mode", "PERMISSIVE") \
      .schema(COMMON_SCHEMA) \
      .json("src/test/resources/sample.jsonl")

  # Show if the read was successful
  df.show()

  # Write the dataFrame to Pinecone in batches 
  df.write \
      .option("pinecone.apiKey", api_key) \
      .option("pinecone.indexName", index_name) \
      .option("pinecone.sourceTag", source_tag) \
      .format("io.pinecone.spark.pinecone.Pinecone") \
      .mode("append") \
      .save()
  ```

  ```scala Scala
  import io.pinecone.spark.pinecone.{COMMON_SCHEMA, PineconeOptions}
  import org.apache.spark.SparkConf
  import org.apache.spark.sql.{SaveMode, SparkSession}

  object MainApp extends App {
    // Your API key and index name
    val apiKey = "PINECONE_API_KEY"
    val indexName = "PINECONE_INDEX_NAME"
    val sourceTag = "PINECONE_SOURCE_TAG"

    // Configure Spark to run locally with all available cores
    val conf = new SparkConf()
      .setMaster("local[*]")

    // Create a Spark session with the defined configuration
    val spark = SparkSession.builder().config(conf).getOrCreate()

    // Read the JSON file into a DataFrame, applying the COMMON_SCHEMA
    val df = spark.read
      .option("multiLine", value = true)
      .option("mode", "PERMISSIVE")
      .schema(COMMON_SCHEMA)
      .json("src/test/resources/sample.jsonl") // path to sample.jsonl

    // Define Pinecone options as a Map
    val pineconeOptions = Map(
      PineconeOptions.PINECONE_API_KEY_CONF -> apiKey,
      PineconeOptions.PINECONE_INDEX_NAME_CONF -> indexName,
      PineconeOptions.PINECONE_SOURCE_TAG_CONF -> sourceTag
    )

    // Show if the read was successful
    df.show(df.count().toInt)
    
    // Write the DataFrame to Pinecone using the defined options in batches
    df.write
      .options(pineconeOptions)
      .format("io.pinecone.spark.pinecone.Pinecone")
      .mode(SaveMode.Append)
      .save()
  }
  ```
</CodeGroup>

<Tip>
  For a guide on how to set up batch upserts, refer to the [Databricks integration page](/integrations/databricks#setup-guide).
</Tip>

## Stream upsert

To stream upsert embeddings to Pinecone:

<CodeGroup>
  ```python Python
  from pyspark.sql import SparkSession
  from pyspark.sql.types import StructType, StructField, ArrayType, FloatType, StringType, LongType
  import os

  # Your API key and index name
  api_key = "PINECONE_API_KEY"
  index_name = "PINECONE_INDEX_NAME"
  source_tag = "PINECONE_SOURCE_TAG"

  COMMON_SCHEMA = StructType([
      StructField("id", StringType(), False),
      StructField("namespace", StringType(), True),
      StructField("values", ArrayType(FloatType(), False), False),
      StructField("metadata", StringType(), True),
      StructField("sparse_values", StructType([
          StructField("indices", ArrayType(LongType(), False), False),
          StructField("values", ArrayType(FloatType(), False), False)
      ]), True)
  ])

  # Initialize Spark session
  spark = SparkSession.builder \
      .appName("StreamUpsertExample") \
      .config("spark.sql.shuffle.partitions", 3) \
      .master("local") \
      .getOrCreate()

  # Read the stream of JSON files, applying the schema from the input directory
  lines = spark.readStream \
      .option("multiLine", True) \
      .option("mode", "PERMISSIVE") \
      .schema(COMMON_SCHEMA) \
      .json("path/to/input/directory/")

  # Write the stream to Pinecone using the defined options
  upsert = lines.writeStream \
      .format("io.pinecone.spark.pinecone.Pinecone") \
      .option("pinecone.apiKey", api_key) \
      .option("pinecone.indexName", index_name) \
      .option("pinecone.sourceTag", source_tag) \
      .option("checkpointLocation", "path/to/checkpoint/dir") \
      .outputMode("append") \
      .start()

  upsert.awaitTermination()
  ```

  ```scala Scala
  import io.pinecone.spark.pinecone.{COMMON_SCHEMA, PineconeOptions}
  import org.apache.spark.SparkConf
  import org.apache.spark.sql.{SaveMode, SparkSession}

  object MainApp extends App {
    // Your API key and index name
    val apiKey = "PINECONE_API_KEY"
    val indexName = "PINECONE_INDEX_NAME"

    // Create a Spark session
    val spark = SparkSession.builder()
      .appName("StreamUpsertExample")
      .config("spark.sql.shuffle.partitions", 3)
      .master("local")
      .getOrCreate()

    // Read the JSON files into a DataFrame, applying the COMMON_SCHEMA from input directory
    val lines = spark.readStream
      .option("multiLine", value = true)
      .option("mode", "PERMISSIVE")
      .schema(COMMON_SCHEMA)
      .json("path/to/input/directory/")

    // Define Pinecone options as a Map
    val pineconeOptions = Map(
      PineconeOptions.PINECONE_API_KEY_CONF -> System.getenv("PINECONE_API_KEY"),
      PineconeOptions.PINECONE_INDEX_NAME_CONF -> System.getenv("PINECONE_INDEX"),
      PineconeOptions.PINECONE_SOURCE_TAG_CONF -> System.getenv("PINECONE_SOURCE_TAG")
    )

    // Write the stream to Pinecone using the defined options
    val upsert = lines
      .writeStream
      .format("io.pinecone.spark.pinecone.Pinecone")
      .options(pineconeOptions)
      .option("checkpointLocation", "path/to/checkpoint/dir")
      .outputMode("append")
      .start()

    upsert.awaitTermination()
  }
  ```
</CodeGroup>

## Learn more

* [Spark-Pinecone connector setup guide](/integrations/databricks#setup-guide)
* [GitHub](https://github.com/pinecone-io/spark-pinecone)
