# CI/CD with Pinecone Local and GitHub Actions

Pinecone Local is an in-memory Pinecone Database emulator available as a Docker image.

This page shows you how to build a CI/CD workflow with Pinecone Local and [GitHub Actions](https://docs.github.com/en/actions) to test your integration without connecting to your Pinecone account, affecting production data, or incurring any usage or storage fees.

<Warning>
  Pinecone Local is not suitable for production. See [Limitations](#limitations) for details.
</Warning>

<Note>
  This feature is in [public preview](/release-notes/feature-availability).
</Note>

## Limitations

Pinecone Local has the following limitations:

* Pinecone Local is available in Docker only.
* Pinecone Local is an in-memory emulator and is not suitable for production. Records loaded into Pinecone Local do not persist after it is stopped.
* Pinecone Local does not authenticate client requests. API keys are ignored.
* Max number of records per index: 100,000.

Pinecone Local does not currently support the following features:

* [Bulk import](/guides/index-data/import-data)
* [Backups](/guides/manage-data/backups-overview)
* [Collections](/guides/indexes/pods/understanding-collections)
* [Pinecone Inference](/reference/api/introduction#inference)
* [Pinecone Assistant](/guides/assistant/overview)

## 1. Write your tests

Running code against Pinecone Local is just like running code against your Pinecone account, with the following differences:

* Pinecone Local does not authenticate client requests. API keys are ignored.

* The latest version of Pinecone Local uses [Pinecone API version](/reference/api/versioning) `2025-01` and requires [Python SDK](/reference/python-sdk) `v6.x` or later, [Node.js SDK](/reference/node-sdk) `v5.x` or later, [Java SDK](/reference/java-sdk) `v4.x` or later, [Go SDK](/reference/go-sdk) `v3.x` or later, and [.NET SDK](/reference/dotnet-sdk) `v3.x` or later.

<Note>
  Be sure to review the [limitations](#limitations) of Pinecone Local before using it for development or testing.
</Note>

**Example**

The following example assumes that you have [started Pinecone Local without indexes](/guides/operations/local-development#database-emulator). It initializes a client, creates a [dense index](/guides/index-data/indexing-overview#dense-indexes) and a [sparse index](/guides/index-data/indexing-overview#sparse-indexes), upserts records into the indexes, checks their record counts, and queries the indexes.

<CodeGroup>
  ```python Python
  from pinecone.grpc import PineconeGRPC, GRPCClientConfig
  from pinecone import ServerlessSpec

  # Initialize a client.
  # API key is required, but the value does not matter.
  # Host and port of the Pinecone Local instance
  # is required when starting without indexes. 
  pc = PineconeGRPC(
      api_key="pclocal", 
      host="http://localhost:5080" 
  )                                    

  # Create two indexes, one dense and one sparse
  dense_index_name = "dense-index"
  sparse_index_name = "sparse-index"

  if not pc.has_index(dense_index_name):  
      dense_index_model = pc.create_index(
          name=dense_index_name,
          vector_type="dense",
          dimension=2,
          metric="cosine",
          spec=ServerlessSpec(cloud="aws", region="us-east-1"),
          deletion_protection="disabled",
          tags={"environment": "development"}
      )

  print("Dense index model:\n", dense_index_model)

  if not pc.has_index(sparse_index_name):  
      sparse_index_model = pc.create_index(
          name=sparse_index_name,
          vector_type="sparse",
          metric="dotproduct",
          spec=ServerlessSpec(cloud="aws", region="us-east-1"),
          deletion_protection="disabled",
          tags={"environment": "development"}
      )

  print("\nSparse index model:\n", sparse_index_model)

  # Target each index, disabling tls
  dense_index_host = pc.describe_index(name=dense_index_name).host
  dense_index = pc.Index(host=dense_index_host, grpc_config=GRPCClientConfig(secure=False))
  sparse_index_host = pc.describe_index(name=sparse_index_name).host
  sparse_index = pc.Index(host=sparse_index_host, grpc_config=GRPCClientConfig(secure=False))

  # Upsert records into the dense index
  dense_index.upsert(
      vectors=[
          {
              "id": "vec1", 
              "values": [1.0, -2.5],
              "metadata": {"genre": "drama"}
          },
          {
              "id": "vec2", 
              "values": [3.0, -2.0],
              "metadata": {"genre": "documentary"}
          },
          {
              "id": "vec3", 
              "values": [0.5, -1.5],
              "metadata": {"genre": "documentary"}
          }
      ],
      namespace="example-namespace"
  )

  # Upsert records into the sparse index
  sparse_index.upsert(
      namespace="example-namespace",
      vectors=[
          {
              "id": "vec1",
              "sparse_values": {
                  "values": [1.7958984, 0.41577148, 2.828125, 2.8027344, 2.8691406, 1.6533203, 5.3671875, 1.3046875, 0.49780273, 0.5722656, 2.71875, 3.0820312, 2.5019531, 4.4414062, 3.3554688],
                  "indices": [822745112, 1009084850, 1221765879, 1408993854, 1504846510, 1596856843, 1640781426, 1656251611, 1807131503, 2543655733, 2902766088, 2909307736, 3246437992, 3517203014, 3590924191]
              },
              "metadata": {
                  "chunk_text": "AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones.",
                  "category": "technology",
                  "quarter": "Q3"
              }
          },
          {
              "id": "vec2",
              "sparse_values": {
                  "values": [0.4362793, 3.3457031, 2.7714844, 3.0273438, 3.3164062, 5.6015625, 2.4863281, 0.38134766, 1.25, 2.9609375, 0.34179688, 1.4306641, 0.34375, 3.3613281, 1.4404297, 2.2558594, 2.2597656, 4.8710938, 0.5605469],
                  "indices": [131900689, 592326839, 710158994, 838729363, 1304885087, 1640781426, 1690623792, 1807131503, 2066971792, 2428553208, 2548600401, 2577534050, 3162218338, 3319279674, 3343062801, 3476647774, 3485013322, 3517203014, 4283091697]
              },
              "metadata": {
                  "chunk_text": "Analysts suggest that AAPL'\''s upcoming Q4 product launch event might solidify its position in the premium smartphone market.",
                  "category": "technology",
                  "quarter": "Q4"
              }
          },
          {
              "id": "vec3",
              "sparse_values": {
                  "values": [2.6875, 4.2929688, 3.609375, 3.0722656, 2.1152344, 5.78125, 3.7460938, 3.7363281, 1.2695312, 3.4824219, 0.7207031, 0.0826416, 4.671875, 3.7011719, 2.796875, 0.61621094],
                  "indices": [8661920, 350356213, 391213188, 554637446, 1024951234, 1640781426, 1780689102, 1799010313, 2194093370, 2632344667, 2641553256, 2779594451, 3517203014, 3543799498, 3837503950, 4283091697]
              },
              "metadata": {
                  "chunk_text": "AAPL'\''s strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production",
                  "category": "technology",
                  "quarter": "Q3"
              }
          }
      ]
  )

  # Check the number of records in each index
  print("\nDense index stats:\n", dense_index.describe_index_stats())
  print("\nSparse index stats:\n", sparse_index.describe_index_stats())

  # Query the dense index with a metadata filter
  dense_response = dense_index.query(
      namespace="example-namespace",
      vector=[3.0, -2.0],
      filter={"genre": {"$eq": "documentary"}},
      top_k=1,
      include_values=False,
      include_metadata=True
  )

  print("\nDense query response:\n", dense_response)

  # Query the sparse index with a metadata filter
  sparse_response = sparse_index.query(
      namespace="example-namespace",
      sparse_vector={
        "values": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        "indices": [767227209, 1640781426, 1690623792, 2021799277, 2152645940, 2295025838, 2443437770, 2779594451, 2956155693, 3476647774, 3818127854, 4283091697]
      }, 
      filter={
          "quarter": {"$eq": "Q4"}
      },
      top_k=1,
      include_values=False,
      include_metadata=True
  )

  print("/nSparse query response:\n", sparse_response)

  # Delete the indexes
  pc.delete_index(name=dense_index_name)
  pc.delete_index(name=sparse_index_name)
  ```

  ```javascript JavaScript
  import { Pinecone } from '@pinecone-database/pinecone';

  // Initialize a client.
  // API key is required, but the value does not matter.
  // Host and port of the Pinecone Local instance
  // is required when starting without indexes.
  const pc = new Pinecone({ 
      apiKey: 'pclocal', 
      controllerHostUrl: 'http://localhost:5080' 
  });

  // Create two indexes, one dense and one sparse
  const denseIndexName = 'dense-index';
  const sparseIndexName = 'sparse-index';

  const denseIndexModel = await pc.createIndex({
    name: denseIndexName,
    vectorType: 'dense',
    dimension: 2,
    metric: 'cosine',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1'
      }
    },
    deletionProtection: 'disabled',
    tags: { environment: 'development' }, 
  });

  console.log('Dense index model:', denseIndexModel);

  const sparseIndexModel = await pc.createIndex({
      name: sparseIndexName,
      vectorType: 'sparse',
      metric: 'dotproduct',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      },
      deletionProtection: 'disabled',
      tags: { environment: 'development' }, 
    });
    
  console.log('\nSparse index model:', sparseIndexModel);
    
  // Target each index
  const denseIndexHost = (await pc.describeIndex(denseIndexName)).host;
  const denseIndex = await pc.index(denseIndexName, 'http://' + denseIndexHost);
  const sparseIndexHost = (await pc.describeIndex(sparseIndexName)).host;
  const sparseIndex = await pc.index(sparseIndexName, 'http://' + sparseIndexHost);

  // Upsert records into the dense index
  await denseIndex.namespace('example-namespace').upsert([
      {
          id: 'vec1', 
          values: [1.0, -2.5],
          metadata: { genre: 'drama' },
      },
      {
          id: 'vec2', 
          values: [3.0, -2.0],
          metadata: { genre: 'documentary' },
      },
      {
          id: 'vec3', 
          values: [0.5, -1.5],
          metadata: { genre: 'documentary' },
      }
  ]);

  // Upsert records into the sparse index
  await sparseIndex.namespace('example-namespace').upsert([
      {
          id: 'vec1',
          sparseValues: {
              indices: [822745112, 1009084850, 1221765879, 1408993854, 1504846510, 1596856843, 1640781426, 1656251611, 1807131503, 2543655733, 2902766088, 2909307736, 3246437992, 3517203014, 3590924191],
              values: [1.7958984, 0.41577148, 2.828125, 2.8027344, 2.8691406, 1.6533203, 5.3671875, 1.3046875, 0.49780273, 0.5722656, 2.71875, 3.0820312, 2.5019531, 4.4414062, 3.3554688]
          },
          metadata: { 
              chunk_text: 'AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones.', 
              category: 'technology',
              quarter: 'Q3' 
          }
      },
      {
          id: 'vec2',
          sparseValues: {
              indices: [131900689, 592326839, 710158994, 838729363, 1304885087, 1640781426, 1690623792, 1807131503, 2066971792, 2428553208, 2548600401, 2577534050, 3162218338, 3319279674, 3343062801, 3476647774, 3485013322, 3517203014, 4283091697],
              values: [0.4362793, 3.3457031, 2.7714844, 3.0273438, 3.3164062, 5.6015625, 2.4863281, 0.38134766, 1.25, 2.9609375, 0.34179688, 1.4306641, 0.34375, 3.3613281, 1.4404297, 2.2558594, 2.2597656, 4.8710938, 0.5605469]
          },
          metadata: { 
              chunk_text: "Analysts suggest that AAPL's upcoming Q4 product launch event might solidify its position in the premium smartphone market.", 
              category: 'technology',
              quarter: 'Q4' 
          }
      },
      {
          id: 'vec3',
          sparseValues: {
              indices: [8661920, 350356213, 391213188, 554637446, 1024951234, 1640781426, 1780689102, 1799010313, 2194093370, 2632344667, 2641553256, 2779594451, 3517203014, 3543799498, 3837503950, 4283091697],
              values: [2.6875, 4.2929688, 3.609375, 3.0722656, 2.1152344, 5.78125, 3.7460938, 3.7363281, 1.2695312, 3.4824219, 0.7207031, 0.0826416, 4.671875, 3.7011719, 2.796875, 0.61621094]
          },
          metadata: { 
              chunk_text: "AAPL's strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production", 
              category: 'technology',
              quarter: 'Q3' 
          }
      }
  ]);
    
  // Check the number of records in each index
  console.log('\nDense index stats:', await denseIndex.describeIndexStats());
  console.log('\nSparse index stats:', await sparseIndex.describeIndexStats());

  // Query the dense index with a metadata filter
  const denseQueryResponse = await denseIndex.namespace('example-namespace').query({
      vector: [3.0, -2.0],
      filter: {
          'genre': {'$eq': 'documentary'}
      },
      topK: 1,
      includeValues: false,
      includeMetadata: true,
  });

  console.log('\nDense query response:', denseQueryResponse);

  const sparseQueryResponse = await sparseIndex.namespace('example-namespace').query({
      sparseVector: {
          indices: [767227209, 1640781426, 1690623792, 2021799277, 2152645940, 2295025838, 2443437770, 2779594451, 2956155693, 3476647774, 3818127854, 4283091697],
          values: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
      },
      topK: 1,
      includeValues: false,
      includeMetadata: true
  });

  console.log('\nSparse query response:', sparseQueryResponse);

  // Delete the index
  await pc.deleteIndex(denseIndexName);
  await pc.deleteIndex(sparseIndexName);
  ```

  ```java Java
  import com.google.protobuf.Struct;
  import com.google.protobuf.Value;
  import io.pinecone.clients.Index;
  import io.pinecone.clients.Pinecone;
  import io.pinecone.proto.DescribeIndexStatsResponse;
  import org.openapitools.db_control.client.model.DeletionProtection;
  import io.pinecone.unsigned_indices_model.QueryResponseWithUnsignedIndices;

  import java.util.*;

  public class PineconeLocalExample {
      public static void main(String[] args) {
          // Initialize a client.
          // API key is required, but the value does not matter.
          // When starting without indexes, disable TLS and
          // provide the host and port of the Pinecone Local instance.
          String host = "http://localhost:5080";
          Pinecone pc = new Pinecone.Builder("pclocal")
                  .withHost(host)
                  .withTlsEnabled(false)
                  .build();

          // Create two indexes, one dense and one sparse
          String denseIndexName = "dense-index";
          String sparseIndexName = "sparse-index";
          HashMap<String, String> tags = new HashMap<>();
          tags.put("environment", "development");
          pc.createServerlessIndex(
                  denseIndexName,
                  "cosine",
                  2,
                  "aws",
                  "us-east-1",
                  DeletionProtection.DISABLED,
                  tags
          );
          pc.createSparseServelessIndex(
                  sparseIndexName,
                  "aws",
                  "us-east-1",
                  DeletionProtection.DISABLED,
                  tags,
                  "sparse"
          );

          // Get index connection objects
          Index denseIndexConnection = pc.getIndexConnection(denseIndexName);
          Index sparseIndexConnection = pc.getIndexConnection(sparseIndexName);

          // Upsert records into the dense index
          Struct metaData1 = Struct.newBuilder()
                  .putFields("genre", Value.newBuilder().setStringValue("drama").build())
                  .build();
          Struct metaData2 = Struct.newBuilder()
                  .putFields("genre", Value.newBuilder().setStringValue("documentary").build())
                  .build();
          Struct metaData3 = Struct.newBuilder()
                  .putFields("genre", Value.newBuilder().setStringValue("documentary").build())
                  .build();

          denseIndexConnection.upsert("vec1", Arrays.asList(1.0f, -2.5f),  null, null, metaData1, "example-namespace");
          denseIndexConnection.upsert("vec2", Arrays.asList(3.0f, -2.0f),  null, null, metaData2, "example-namespace");
          denseIndexConnection.upsert("vec3", Arrays.asList(0.5f, -1.5f),  null, null, metaData3, "example-namespace");

          // Upsert records into the sparse index
          ArrayList<Long> indices1 = new ArrayList<>(Arrays.asList(
                  822745112L, 1009084850L, 1221765879L, 1408993854L, 1504846510L,
                  1596856843L, 1640781426L, 1656251611L, 1807131503L, 2543655733L,
                  2902766088L, 2909307736L, 3246437992L, 3517203014L, 3590924191L
          ));

          ArrayList<Float> values1 = new ArrayList<>(Arrays.asList(
                  1.7958984f, 0.41577148f, 2.828125f, 2.8027344f, 2.8691406f,
                  1.6533203f, 5.3671875f, 1.3046875f, 0.49780273f, 0.5722656f,
                  2.71875f, 3.0820312f, 2.5019531f, 4.4414062f, 3.3554688f
          ));

          Struct sparseMetaData1 = Struct.newBuilder()
                  .putFields("chunk_text", Value.newBuilder().setStringValue("AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones.").build())
                  .putFields("category", Value.newBuilder().setStringValue("technology").build())
                  .putFields("quarter", Value.newBuilder().setStringValue("Q3").build())
                  .build();

          ArrayList<Long> indices2 = new ArrayList<>(Arrays.asList(
                  131900689L, 592326839L, 710158994L, 838729363L, 1304885087L,
                  1640781426L, 1690623792L, 1807131503L, 2066971792L, 2428553208L,
                  2548600401L, 2577534050L, 3162218338L, 3319279674L, 3343062801L,
                  3476647774L, 3485013322L, 3517203014L, 4283091697L
          ));

          ArrayList<Float> values2 = new ArrayList<>(Arrays.asList(
                  0.4362793f, 3.3457031f, 2.7714844f, 3.0273438f, 3.3164062f,
                  5.6015625f, 2.4863281f, 0.38134766f, 1.25f, 2.9609375f,
                  0.34179688f, 1.4306641f, 0.34375f, 3.3613281f, 1.4404297f,
                  2.2558594f, 2.2597656f, 4.8710938f, 0.5605469f
          ));

          Struct sparseMetaData2 = Struct.newBuilder()
                  .putFields("chunk_text", Value.newBuilder().setStringValue("Analysts suggest that AAPL'\\''s upcoming Q4 product launch event might solidify its position in the premium smartphone market.").build())
                  .putFields("category", Value.newBuilder().setStringValue("technology").build())
                  .putFields("quarter", Value.newBuilder().setStringValue("Q4").build())
                  .build();

          ArrayList<Long> indices3 = new ArrayList<>(Arrays.asList(
                  8661920L, 350356213L, 391213188L, 554637446L, 1024951234L,
                  1640781426L, 1780689102L, 1799010313L, 2194093370L, 2632344667L,
                  2641553256L, 2779594451L, 3517203014L, 3543799498L,
                  3837503950L, 4283091697L
          ));

          ArrayList<Float> values3 = new ArrayList<>(Arrays.asList(
                  2.6875f, 4.2929688f, 3.609375f, 3.0722656f, 2.1152344f,
                  5.78125f, 3.7460938f, 3.7363281f, 1.2695312f, 3.4824219f,
                  0.7207031f, 0.0826416f, 4.671875f, 3.7011719f, 2.796875f,
                  0.61621094f
          ));

          Struct sparseMetaData3 = Struct.newBuilder()
                  .putFields("chunk_text", Value.newBuilder().setStringValue("AAPL'\\''s strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production").build())
                  .putFields("category", Value.newBuilder().setStringValue("technology").build())
                  .putFields("quarter", Value.newBuilder().setStringValue("Q3").build())
                  .build();

          sparseIndexConnection.upsert("vec1", Collections.emptyList(), indices1, values1, sparseMetaData1, "example-namespace");
          sparseIndexConnection.upsert("vec2", Collections.emptyList(), indices2, values2, sparseMetaData2, "example-namespace");
          sparseIndexConnection.upsert("vec3", Collections.emptyList(), indices3, values3, sparseMetaData3, "example-namespace");

          // Check the number of records each the index
          DescribeIndexStatsResponse denseIndexStatsResponse = denseIndexConnection.describeIndexStats(null);
          System.out.println("Dense index stats:");
          System.out.println(denseIndexStatsResponse);
          DescribeIndexStatsResponse sparseIndexStatsResponse = sparseIndexConnection.describeIndexStats(null);
          System.out.println("Sparse index stats:");
          System.out.println(sparseIndexStatsResponse);

          // Query the dense index with a metadata filter
          List<Float> queryVector = Arrays.asList(1.0f, 1.5f);
          QueryResponseWithUnsignedIndices denseQueryResponse = denseIndexConnection.query(1, queryVector, null, null, null, "example-namespace", null, false, true);
          System.out.println("Dense query response:");
          System.out.println(denseQueryResponse);

          // Query the sparse index with a metadata filter
          List<Long> sparseIndices = Arrays.asList(
                  767227209L, 1640781426L, 1690623792L, 2021799277L, 2152645940L,
                  2295025838L, 2443437770L, 2779594451L, 2956155693L, 3476647774L,
                  3818127854L, 428309169L);
          List<Float> sparseValues = Arrays.asList(
                  1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f,
                  1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f);

          QueryResponseWithUnsignedIndices sparseQueryResponse = sparseIndexConnection.query(1, null, sparseIndices, sparseValues, null, "example-namespace", null, false, true);
          System.out.println("Sparse query response:");
          System.out.println(sparseQueryResponse);

          // Delete the indexes
          pc.deleteIndex(denseIndexName);
          pc.deleteIndex(sparseIndexName);
      }
  }
  ```

  ```go Go
  package main

  import (
  	"context"
  	"encoding/json"
  	"fmt"
  	"log"

  	"github.com/pinecone-io/go-pinecone/v3/pinecone"
  	"google.golang.org/protobuf/types/known/structpb"
  )

  func prettifyStruct(obj interface{}) string {
  	bytes, _ := json.MarshalIndent(obj, "", "  ")
  	return string(bytes)
  }

  func main() {
  	ctx := context.Background()

  	// Initialize a client.
  	// No API key is required.
  	// Host and port of the Pinecone Local instance
  	// is required when starting without indexes.
  	pc, err := pinecone.NewClientBase(pinecone.NewClientBaseParams{
  		Host: "http://localhost:5080",
  	})
  	if err != nil {
  		log.Fatalf("Failed to create Client: %v", err)
  	}

  	// Create two indexes, one dense and one sparse
  	denseIndexName := "dense-index"
  	denseVectorType := "dense"
  	dimension := int32(2)
  	denseMetric := pinecone.Cosine
  	deletionProtection := pinecone.DeletionProtectionDisabled
  	denseIdx, err := pc.CreateServerlessIndex(ctx, &pinecone.CreateServerlessIndexRequest{
  		Name:               denseIndexName,
  		VectorType:         &denseVectorType,
  		Dimension:          &dimension,
  		Metric:             &denseMetric,
  		Cloud:              pinecone.Aws,
  		Region:             "us-east-1",
  		DeletionProtection: &deletionProtection,
  		Tags:               &pinecone.IndexTags{"environment": "development"},
  	})
  	if err != nil {
  		log.Fatalf("Failed to create serverless index: %v", denseIdx.Name)
  	} else {
  		fmt.Printf("Successfully created serverless index: %v\n", denseIdx.Name)
  	}

  	sparseIndexName := "sparse-index"
  	sparseVectorType := "sparse"
  	sparseMetric := pinecone.Dotproduct
  	sparseIdx, err := pc.CreateServerlessIndex(ctx, &pinecone.CreateServerlessIndexRequest{
  		Name:               sparseIndexName,
  		VectorType:         &sparseVectorType,
  		Metric:             &sparseMetric,
  		Cloud:              pinecone.Aws,
  		Region:             "us-east-1",
  		DeletionProtection: &deletionProtection,
  		Tags:               &pinecone.IndexTags{"environment": "development"},
  	})
  	if err != nil {
  		log.Fatalf("Failed to create serverless index: %v", sparseIdx.Name)
  	} else {
  		fmt.Printf("\nSuccessfully created serverless index: %v\n", sparseIdx.Name)
  	}

  	// Get the index hosts
  	denseIdxModel, err := pc.DescribeIndex(ctx, denseIndexName)
  	if err != nil {
  		log.Fatalf("Failed to describe index \"%v\": %v", denseIndexName, err)
  	}

  	sparseIdxModel, err := pc.DescribeIndex(ctx, sparseIndexName)
  	if err != nil {
  		log.Fatalf("Failed to describe index \"%v\": %v", sparseIndexName, err)
  	}

  	// Target the indexes.
  	// Make sure to prefix the hosts with http:// to let the SDK know to disable tls.
  	denseIdxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "http://" + denseIdxModel.Host, Namespace: "example-namespace"})
  	if err != nil {
  		log.Fatalf("Failed to create IndexConnection for Host: %v", err)
  	}

  	sparseIdxConnection, err := pc.Index(pinecone.NewIndexConnParams{Host: "http://" + sparseIdxModel.Host, Namespace: "example-namespace"})
  	if err != nil {
  		log.Fatalf("Failed to create IndexConnection for Host: %v", err)
  	}

  	// Upsert records into the dense index
  	denseMetadataMap1 := map[string]interface{}{
  		"genre": "drama",
  	}

  	denseMetadata1, err := structpb.NewStruct(denseMetadataMap1)
  	if err != nil {
  		log.Fatalf("Failed to create metadata map: %v", err)
  	}

  	denseMetadataMap2 := map[string]interface{}{
  		"genre": "documentary",
  	}

  	denseMetadata2, err := structpb.NewStruct(denseMetadataMap2)
  	if err != nil {
  		log.Fatalf("Failed to create metadata map: %v", err)
  	}

  	denseMetadataMap3 := map[string]interface{}{
  		"genre": "documentary",
  	}

  	denseMetadata3, err := structpb.NewStruct(denseMetadataMap3)
  	if err != nil {
  		log.Fatalf("Failed to create metadata map: %v", err)
  	}

  	denseVectors := []*pinecone.Vector{
  		{
  			Id:       "vec1",
  			Values:   &[]float32{1.0, -2.5},
  			Metadata: denseMetadata1,
  		},
  		{
  			Id:       "vec2",
  			Values:   &[]float32{3.0, -2.0},
  			Metadata: denseMetadata2,
  		},
  		{
  			Id:       "vec3",
  			Values:   &[]float32{0.5, -1.5},
  			Metadata: denseMetadata3,
  		},
  	}

  	denseCount, err := denseIdxConnection.UpsertVectors(ctx, denseVectors)
  	if err != nil {
  		log.Fatalf("Failed to upsert vectors: %v", err)
  	} else {
  		fmt.Printf("\nSuccessfully upserted %d vector(s)!\n", denseCount)
  	}

  	// Upsert records into the sparse index
  	sparseValues1 := pinecone.SparseValues{
  		Indices: []uint32{822745112, 1009084850, 1221765879, 1408993854, 1504846510, 1596856843, 1640781426, 1656251611, 1807131503, 2543655733, 2902766088, 2909307736, 3246437992, 3517203014, 3590924191},
  		Values:  []float32{1.7958984, 0.41577148, 2.828125, 2.8027344, 2.8691406, 1.6533203, 5.3671875, 1.3046875, 0.49780273, 0.5722656, 2.71875, 3.0820312, 2.5019531, 4.4414062, 3.3554688},
  	}

  	sparseMetadataMap1 := map[string]interface{}{
  		"chunk_text": "AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones",
  		"category":   "technology",
  		"quarter":    "Q3",
  	}

  	sparseMetadata1, err := structpb.NewStruct(sparseMetadataMap1)
  	if err != nil {
  		log.Fatalf("Failed to create metadata map: %v", err)
  	}

  	sparseValues2 := pinecone.SparseValues{
  		Indices: []uint32{131900689, 592326839, 710158994, 838729363, 1304885087, 1640781426, 1690623792, 1807131503, 2066971792, 2428553208, 2548600401, 2577534050, 3162218338, 3319279674, 3343062801, 3476647774, 3485013322, 3517203014, 4283091697},
  		Values:  []float32{0.4362793, 3.3457031, 2.7714844, 3.0273438, 3.3164062, 5.6015625, 2.4863281, 0.38134766, 1.25, 2.9609375, 0.34179688, 1.4306641, 0.34375, 3.3613281, 1.4404297, 2.2558594, 2.2597656, 4.8710938, 0.560546},
  	}

  	sparseMetadataMap2 := map[string]interface{}{
  		"chunk_text": "Analysts suggest that AAPL's upcoming Q4 product launch event might solidify its position in the premium smartphone market.",
  		"category":   "technology",
  		"quarter":    "Q4",
  	}

  	sparseMetadata2, err := structpb.NewStruct(sparseMetadataMap2)
  	if err != nil {
  		log.Fatalf("Failed to create metadata map: %v", err)
  	}

  	sparseValues3 := pinecone.SparseValues{
  		Indices: []uint32{8661920, 350356213, 391213188, 554637446, 1024951234, 1640781426, 1780689102, 1799010313, 2194093370, 2632344667, 2641553256, 2779594451, 3517203014, 3543799498, 3837503950, 4283091697},
  		Values:  []float32{2.6875, 4.2929688, 3.609375, 3.0722656, 2.1152344, 5.78125, 3.7460938, 3.7363281, 1.2695312, 3.4824219, 0.7207031, 0.0826416, 4.671875, 3.7011719, 2.796875, 0.61621094},
  	}

  	sparseMetadataMap3 := map[string]interface{}{
  		"chunk_text": "AAPL's strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production",
  		"category":   "technology",
  		"quarter":    "Q3",
  	}

  	sparseMetadata3, err := structpb.NewStruct(sparseMetadataMap3)
  	if err != nil {
  		log.Fatalf("Failed to create metadata map: %v", err)
  	}

  	sparseVectors := []*pinecone.Vector{
  		{
  			Id:           "vec1",
  			SparseValues: &sparseValues1,
  			Metadata:     sparseMetadata1,
  		},
  		{
  			Id:           "vec2",
  			SparseValues: &sparseValues2,
  			Metadata:     sparseMetadata2,
  		},
  		{
  			Id:           "vec3",
  			SparseValues: &sparseValues3,
  			Metadata:     sparseMetadata3,
  		},
  	}

  	sparseCount, err := sparseIdxConnection.UpsertVectors(ctx, sparseVectors)
  	if err != nil {
  		log.Fatalf("Failed to upsert vectors: %v", err)
  	} else {
  		fmt.Printf("\nSuccessfully upserted %d vector(s)!\n", sparseCount)
  	}

  	// Check the number of records in each index
  	denseStats, err := denseIdxConnection.DescribeIndexStats(ctx)
  	if err != nil {
  		log.Fatalf("Failed to describe index: %v", err)
  	} else {
  		fmt.Printf("\nDense index stats: %+v\n", prettifyStruct(*denseStats))
  	}

  	sparseStats, err := sparseIdxConnection.DescribeIndexStats(ctx)
  	if err != nil {
  		log.Fatalf("Failed to describe index: %v", err)
  	} else {
  		fmt.Printf("\nSparse index stats: %+v\n", prettifyStruct(*sparseStats))
  	}

  	// Query the dense index with a metadata filter
  	queryVector := []float32{3.0, -2.0}

  	queryMetadataMap := map[string]interface{}{
  		"genre": map[string]interface{}{
  			"$eq": "documentary",
  		},
  	}

  	metadataFilter, err := structpb.NewStruct(queryMetadataMap)
  	if err != nil {
  		log.Fatalf("Failed to create metadata map: %v", err)
  	}

  	denseRes, err := denseIdxConnection.QueryByVectorValues(ctx, &pinecone.QueryByVectorValuesRequest{
  		Vector:          queryVector,
  		TopK:            1,
  		MetadataFilter:  metadataFilter,
  		IncludeValues:   false,
  		IncludeMetadata: true,
  	})
  	if err != nil {
  		log.Fatalf("Error encountered when querying by vector: %v", err)
  	} else {
  		fmt.Printf("\nDense query response: %v\n", prettifyStruct(denseRes))
  	}

  	// Query the sparse index with a metadata filter

  	sparseValues := pinecone.SparseValues{
  		Indices: []uint32{767227209, 1640781426, 1690623792, 2021799277, 2152645940, 2295025838, 2443437770, 2779594451, 2956155693, 3476647774, 3818127854, 4283091697},
  		Values:  []float32{1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0},
  	}

  	sparseRes, err := sparseIdxConnection.QueryByVectorValues(ctx, &pinecone.QueryByVectorValuesRequest{
  		SparseValues:    &sparseValues,
  		TopK:            1,
  		IncludeValues:   false,
  		IncludeMetadata: true,
  	})
  	if err != nil {
  		log.Fatalf("Error encountered when querying by vector: %v", err)
  	} else {
  		fmt.Printf("\nSparse query response: %v\n", prettifyStruct(sparseRes))
  	}
  	// Delete the indexes
  	err = pc.DeleteIndex(ctx, denseIndexName)
  	if err != nil {
  		log.Fatalf("Failed to delete index: %v", err)
  	} else {
  		fmt.Printf("\nIndex \"%v\" deleted successfully\n", denseIndexName)
  	}

  	err = pc.DeleteIndex(ctx, sparseIndexName)
  	if err != nil {
  		log.Fatalf("Failed to delete index: %v", err)
  	} else {
  		fmt.Printf("\nIndex \"%v\" deleted successfully\n", sparseIndexName)
  	}
  }
  ```

  ```csharp C#
  using Pinecone;

  // Initialize a client.
  // API key is required, but the value does not matter.
  // When starting without indexes, disable TLS and
  // provide the host and port of the Pinecone Local instance.
  var pc = new PineconeClient("pclocal",
      new ClientOptions
      {
          BaseUrl = "http://localhost:5080",
          IsTlsEnabled = false
      }
  );

  // Create two indexes, one dense and one sparse
  var denseIndexName = "dense-index";
  var sparseIndexName = "sparse-index";

  var createDenseIndexRequest = await pc.CreateIndexAsync(new CreateIndexRequest
  {
      Name = denseIndexName,
      VectorType = VectorType.Dense,
      Dimension = 2,
      Metric = MetricType.Cosine,
      Spec = new ServerlessIndexSpec
      {
          Serverless = new ServerlessSpec
          {
              Cloud = ServerlessSpecCloud.Aws,
              Region = "us-east-1"
          }
      },
      DeletionProtection = DeletionProtection.Disabled,
      Tags = new Dictionary<string, string> 
      {  
          { "environment", "development" }
      }
  });

  Console.WriteLine("Dense index model:" + createDenseIndexRequest);

  var createSparseIndexRequest = await pc.CreateIndexAsync(new CreateIndexRequest
  {
      Name = sparseIndexName,
      VectorType = VectorType.Sparse,
      Metric = MetricType.Dotproduct,
      Spec = new ServerlessIndexSpec
      {
          Serverless = new ServerlessSpec
          {
              Cloud = ServerlessSpecCloud.Aws,
              Region = "us-east-1"
          }
      },
      DeletionProtection = DeletionProtection.Disabled,
      Tags = new Dictionary<string, string> 
      {  
          { "environment", "development" }
      }
  });

  Console.WriteLine("\nSparse index model:" + createSparseIndexRequest);

  // Target the indexes
  var denseIndex = pc.Index(denseIndexName);
  var sparseIndex = pc.Index(sparseIndexName);

  // Upsert records into the dense index
  var denseUpsertResponse = await denseIndex.UpsertAsync(new UpsertRequest()
  {
      Namespace = "example-namespace",
      Vectors = new List<Vector>
      {
          new Vector 
          { 
              Id = "vec1", 
              Values = new ReadOnlyMemory<float>([1.0f, -2.5f]),
              Metadata = new Metadata {
                  ["genre"] = new("drama"),
              },
          },
          new Vector 
          { 
              Id = "vec2", 
              Values = new ReadOnlyMemory<float>([3.0f, -2.0f]), 
              Metadata = new Metadata {
                  ["genre"] = new("documentary"),
              },
          },
          new Vector 
          { 
              Id = "vec3", 
              Values = new ReadOnlyMemory<float>([0.5f, -1.5f]),
              Metadata = new Metadata {
                  ["genre"] = new("documentary"),
              } 
          }
      }
  });
  Console.WriteLine($"\nUpserted {denseUpsertResponse.UpsertedCount} dense vectors");

  // Upsert records into the sparse index
  var sparseVector1 = new Vector
  {
      Id = "vec1",
      SparseValues = new SparseValues
      {
          Indices = new uint[] { 822745112, 1009084850, 1221765879, 1408993854, 1504846510, 1596856843, 1640781426, 1656251611, 1807131503, 2543655733, 2902766088, 2909307736, 3246437992, 3517203014, 3590924191 },
          Values = new ReadOnlyMemory<float>([1.7958984f, 0.41577148f, 2.828125f, 2.8027344f, 2.8691406f, 1.6533203f, 5.3671875f, 1.3046875f, 0.49780273f, 0.5722656f, 2.71875f, 3.0820312f, 2.5019531f, 4.4414062f, 3.3554688f])
      },
      Metadata = new Metadata {
          ["chunk_text"] = new("AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones."),
          ["category"] = new("technology"),
          ["quarter"] = new("Q3"),
      },
  };

  var sparseVector2 = new Vector
  {
      Id = "vec2",
      SparseValues = new SparseValues
      {
          Indices = new uint[] { 131900689, 592326839, 710158994, 838729363, 1304885087, 1640781426, 1690623792, 1807131503, 2066971792, 2428553208, 2548600401, 2577534050, 3162218338, 3319279674, 3343062801, 3476647774, 3485013322, 3517203014, 4283091697 },
          Values = new ReadOnlyMemory<float>([0.4362793f, 3.3457031f, 2.7714844f, 3.0273438f, 3.3164062f, 5.6015625f, 2.4863281f, 0.38134766f, 1.25f, 2.9609375f, 0.34179688f, 1.4306641f, 0.34375f, 3.3613281f, 1.4404297f, 2.2558594f, 2.2597656f, 4.8710938f, 0.5605469f])
      },
      Metadata = new Metadata {
          ["chunk_text"] = new("Analysts suggest that AAPL'\''s upcoming Q4 product launch event might solidify its position in the premium smartphone market."),
          ["category"] = new("technology"),
          ["quarter"] = new("Q4"),
      },
  };

  var sparseVector3 = new Vector
  {
      Id = "vec3",
      SparseValues = new SparseValues
      {
          Indices = new uint[] { 8661920, 350356213, 391213188, 554637446, 1024951234, 1640781426, 1780689102, 1799010313, 2194093370, 2632344667, 2641553256, 2779594451, 3517203014, 3543799498, 3837503950, 4283091697 },
          Values = new ReadOnlyMemory<float>([2.6875f, 4.2929688f, 3.609375f, 3.0722656f, 2.1152344f, 5.78125f, 3.7460938f, 3.7363281f, 1.2695312f, 3.4824219f, 0.7207031f, 0.0826416f, 4.671875f, 3.7011719f, 2.796875f, 0.61621094f])
      },
      Metadata = new Metadata {
          ["chunk_text"] = new("AAPL'\''s strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production"),
          ["category"] = new("technology"),
          ["quarter"] = new("Q3"),
      },    
  };

  var sparseUpsertResponse = await sparseIndex.UpsertAsync(new UpsertRequest
  {
      Vectors = new List<Vector> { sparseVector1, sparseVector2, sparseVector3 },
      Namespace = "example-namespace"
  });
  Console.WriteLine($"\nUpserted {sparseUpsertResponse.UpsertedCount} sparse vectors");

  // Check the number of records in each index
  var denseIndexStatsResponse = await denseIndex.DescribeIndexStatsAsync(new DescribeIndexStatsRequest());
  Console.WriteLine("\nDense index stats:" + denseIndexStatsResponse);
  var sparseIndexStatsResponse = await sparseIndex.DescribeIndexStatsAsync(new DescribeIndexStatsRequest());
  Console.WriteLine("\nSparse index stats:" + sparseIndexStatsResponse);

  // Query the dense index with a metadata filter
  var denseQueryResponse = await denseIndex.QueryAsync(new QueryRequest
  {
      Vector = new ReadOnlyMemory<float>([3.0f, -2.0f]),
      TopK = 1,
      Namespace = "example-namespace",
      Filter = new Metadata
      {
          ["genre"] = new Metadata
          {
              ["$eq"] = "documentary",
          }
      },
      IncludeValues = false,
      IncludeMetadata = true
  });
  Console.WriteLine("\nDense query response:" + denseQueryResponse);

  // Query the sparse index with a metadata filter
  var sparseQueryResponse = await sparseIndex.QueryAsync(new QueryRequest {
      Namespace = "example-namespace",
      TopK = 1,
      SparseVector = new SparseValues
      {
          Indices = [767227209, 1640781426, 1690623792, 2021799277, 2152645940, 2295025838, 2443437770, 2779594451, 2956155693, 3476647774, 3818127854, 4283091697],
          Values = new[] { 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f },
      },
      Filter = new Metadata
      {
          ["quarter"] = new Metadata
          {
              ["$eq"] = "Q4",
          }
      },
      IncludeValues = false,
      IncludeMetadata = true
  });
  Console.WriteLine("\nSparse query response:" + sparseQueryResponse);

  // Delete the indexes
  await pc.DeleteIndexAsync(denseIndexName);
  await pc.DeleteIndexAsync(sparseIndexName);
  ```

  {/* ```rust Rust
    use pinecone_sdk::models::{Cloud, DeletionProtection, Kind, Metadata, Metric, Value, Vector, WaitPolicy};
    use pinecone_sdk::pinecone::PineconeClientConfig;
    use pinecone_sdk::utils::errors::PineconeError;
    use std::collections::BTreeMap;

    #[tokio::main]
    async fn main() -> Result<(), PineconeError> {
      // Initialize a client.
      // No API key is required.
      // Host and port of the Pinecone Local instance
      // is required when starting without indexes.
      let config = PineconeClientConfig {
          api_key: Some(String::default()),
          control_plane_host: Some("http://localhost:5080".to_string()),
          ..Default::default()
      };

      let pinecone = config.client()?;

      // Create an index
      let index_model = pinecone.create_serverless_index(
          "docs-example",          // Name of the index
          2,                    // Dimension of the vectors
          Metric::Cosine,                 // Distance metric
          Cloud::Aws,                     // Cloud provider
          "us-east-1",             // Region
          DeletionProtection::Disabled,   // Deletion protection
          WaitPolicy::NoWait,             // Timeout
      ).await?;

      let index_host = format!("http://{}", index_model.host);

      // Target the index
      let mut index = pinecone.index(&index_host).await?;

      // Upsert records into the index
      let vectors = [Vector {
          id: "vec1".to_string(),
          values: vec![1.0, -2.5],
          sparse_values: None,
          metadata: Some(Metadata {
              fields: vec![(
                  "genre".to_string(),
                  Value {
                      kind: Some(Kind::StringValue("drama".to_string())),
                  },
              )]
                  .into_iter()
                  .collect(),
          }),
      }, Vector {
          id: "vec2".to_string(),
          values: vec![3.0, -2.0],
          sparse_values: None,
          metadata: Some(Metadata {
              fields: vec![(
                  "genre".to_string(),
                  Value {
                      kind: Some(Kind::StringValue("documentary".to_string())),
                  },
              )]
                  .into_iter()
                  .collect(),
          }),
      }, Vector {
          id: "vec3".to_string(),
          values: vec![0.5, -1.5],
          sparse_values: None,
          metadata: Some(Metadata {
              fields: vec![(
                  "genre".to_string(),
                  Value {
                      kind: Some(Kind::StringValue("documentary".to_string())),
                  },
              )]
                  .into_iter()
                  .collect(),
          }),
      }];

      index.upsert(&vectors, &"example-namespace".into()).await?;

      // Check the number of records in the index
      let index_stats = index.describe_index_stats(None).await?;

      println!("Index stats:\n{:?}", index_stats);

      // Query the index with a metadata filter
      let vector = vec![3.0, -2.0];

      let mut fields = BTreeMap::new();
      let kind = Some(Kind::StringValue("documentary".to_string()));
      fields.insert("genre".to_string(), Value { kind });

      let query_response = index.query_by_value(
          vector,
          None,
          3,
          &"example-namespace".into(),
          Some(Metadata { fields }),
          None,
          Some(true),
      ).await?;

      println!("Query response:\n{:?}", query_response);

      // Delete the index
      pinecone.delete_index(&index_model.name).await?;

      Ok(())
    }
    ``` */}

  ```shell curl
  PINECONE_LOCAL_HOST="localhost:5080"
  DENSE_INDEX_HOST="localhost:5081"
  SPARSE_INDEX_HOST="localhost:5082"

  # Create two indexes, one dense and one sparse
  curl -X POST "http://$PINECONE_LOCAL_HOST/indexes" \
      -H "Accept: application/json" \
      -H "Content-Type: application/json" \
      -H "X-Pinecone-API-Version: 2025-01" \
      -d '{
              "name": "dense-index",
              "vector_type": "dense",
              "dimension": 2,
              "metric": "cosine",
              "spec": {
                  "serverless": {
                      "cloud": "aws",
                      "region": "us-east-1"
                  }
              },
              "tags": {
                  "environment": "development"
              },
              "deletion_protection": "disabled"
          }'

  curl -X POST "http://$PINECONE_LOCAL_HOST/indexes" \
      -H "Accept: application/json" \
      -H "Content-Type: application/json" \
      -H "X-Pinecone-API-Version: 2025-01" \
      -d '{
              "name": "sparse-index",
              "vector_type": "sparse",
              "metric": "dotproduct",
              "spec": {
                  "serverless": {
                      "cloud": "aws",
                      "region": "us-east-1"
                  }
              },
              "tags": {
                  "environment": "development"
              },
              "deletion_protection": "disabled"
          }'

  # Upsert records into the dense index
  curl -X POST "http://$DENSE_INDEX_HOST/vectors/upsert" \
      -H "Content-Type: application/json" \
      -H "X-Pinecone-API-Version: 2025-01" \
      -d '{
              "namespace": "example-namespace",
              "vectors": [
                  {
                      "id": "vec1", 
                      "values": [1.0, -2.5],
                      "metadata": {"genre": "drama"}
                  },
                  {
                      "id": "vec2", 
                      "values": [3.0, -2.0],
                      "metadata": {"genre": "documentary"}
                  },
                  {
                      "id": "vec3", 
                      "values": [0.5, -1.5],
                      "metadata": {"genre": "documentary"}
                  }
              ]
          }'

  # Upsert records into the sparse index
  curl -X POST "http://$SPARSE_INDEX_HOST/vectors/upsert" \
      -H "Content-Type: application/json" \
      -H "X-Pinecone-API-Version: 2025-01" \
      -d '{
              "namespace": "example-namespace",
              "vectors": [
                  {
                      "id": "vec1",
                      "sparseValues": {
                          "values": [1.7958984, 0.41577148, 2.828125, 2.8027344, 2.8691406, 1.6533203, 5.3671875, 1.3046875, 0.49780273, 0.5722656, 2.71875, 3.0820312, 2.5019531, 4.4414062, 3.3554688],
                          "indices": [822745112, 1009084850, 1221765879, 1408993854, 1504846510, 1596856843, 1640781426, 1656251611, 1807131503, 2543655733, 2902766088, 2909307736, 3246437992, 3517203014, 3590924191]
                      },
                      "metadata": {
                          "chunk_text": "AAPL reported a year-over-year revenue increase, expecting stronger Q3 demand for its flagship phones.",
                          "category": "technology",
                          "quarter": "Q3"
                      }
                  },
                  {
                      "id": "vec2",
                      "sparseValues": {
                          "values": [0.4362793, 3.3457031, 2.7714844, 3.0273438, 3.3164062, 5.6015625, 2.4863281, 0.38134766, 1.25, 2.9609375, 0.34179688, 1.4306641, 0.34375, 3.3613281, 1.4404297, 2.2558594, 2.2597656, 4.8710938, 0.5605469],
                          "indices": [131900689, 592326839, 710158994, 838729363, 1304885087, 1640781426, 1690623792, 1807131503, 2066971792, 2428553208, 2548600401, 2577534050, 3162218338, 3319279674, 3343062801, 3476647774, 3485013322, 3517203014, 4283091697]
                      },
                      "metadata": {
                          "chunk_text": "Analysts suggest that AAPL'\''s upcoming Q4 product launch event might solidify its position in the premium smartphone market.",
                          "category": "technology",
                          "quarter": "Q4"
                      }
                  },
                  {
                      "id": "vec3",
                      "sparseValues": {
                          "values": [2.6875, 4.2929688, 3.609375, 3.0722656, 2.1152344, 5.78125, 3.7460938, 3.7363281, 1.2695312, 3.4824219, 0.7207031, 0.0826416, 4.671875, 3.7011719, 2.796875, 0.61621094],
                          "indices": [8661920, 350356213, 391213188, 554637446, 1024951234, 1640781426, 1780689102, 1799010313, 2194093370, 2632344667, 2641553256, 2779594451, 3517203014, 3543799498, 3837503950, 4283091697]
                      },
                      "metadata": {
                          "chunk_text": "AAPL'\''s strategic Q3 partnerships with semiconductor suppliers could mitigate component risks and stabilize iPhone production",
                          "category": "technology",
                          "quarter": "Q3"
                      }
                  }
              ]
          }'

  # Check the number of records in each index
  curl -X POST "http://$DENSE_INDEX_HOST/describe_index_stats" \
      -H "Content-Type: application/json" \
      -H "X-Pinecone-API-Version: 2025-01" \
      -d '{}'

  curl -X POST "http://$SPARSE_INDEX_HOST/describe_index_stats" \
      -H "Content-Type: application/json" \
      -H "X-Pinecone-API-Version: 2025-01" \
      -d '{}'

  # Query the dense index with a metadata filter
  curl "http://$DENSE_INDEX_HOST/query" \
      -H "Content-Type: application/json" \
      -H "X-Pinecone-API-Version: 2025-01" \
      -d '{
              "vector": [3.0, -2.0],
              "filter": {"genre": {"$eq": "documentary"}},
              "topK": 1,
              "includeMetadata": true,
              "includeValues": false,
              "namespace": "example-namespace"
          }'

  # Query the sparse index with a metadata filter
  curl "http://$SPARSE_INDEX_HOST/query" \
      -H "Content-Type: application/json" \
      -H "X-Pinecone-API-Version: 2025-01" \
      -d '{
              "sparseVector": {
                  "values": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
                  "indices": [767227209, 1640781426, 1690623792, 2021799277, 2152645940, 2295025838, 2443437770, 2779594451, 2956155693, 3476647774, 3818127854, 4283091697]
              },
              "filter": {"quarter": {"$eq": "Q4"}},
              "namespace": "example-namespace",
              "topK": 1,
              "includeMetadata": true,
              "includeValues": false
          }'

  # Delete the index
  curl -X DELETE "http://$PINECONE_LOCAL_HOST/indexes/dense-index" \
      -H "X-Pinecone-API-Version: 2025-01"

  curl -X DELETE "http://$PINECONE_LOCAL_HOST/indexes/sparse-index" \
      -H "X-Pinecone-API-Version: 2025-01"
  ```
</CodeGroup>

## 2. Set up GitHub Actions

[Set up a GitHub Actions workflow](https://docs.github.com/en/actions/writing-workflows/quickstart) to do the following:

1. Pull the Pinecone Local Docker image.
2. Start a Pinecone Local instance for each test run.
3. Execute tests against the local instance.
4. Tear down the instance after tests complete.

Here's a sample GitHub Actions workflow that you can extend for your own needs:

```yaml
name: CI/CD with Pinecone Local
on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  pc-local-tests:
    name: Pinecone Local tests
    runs-on: ubuntu-latest
    services:
      pc-local:
        image: ghcr.io/pinecone-io/pinecone-local:latest
        env:
          PORT: 5080
        ports:
          - "5080-6000:5080-6000"
    steps:
      - name: Check out repository code
        uses: actions/checkout@v4

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install "pinecone[grpc]"

      - name: Run tests
        run: |
          pytest test/
```

## 3. Run your tests

GitHub Actions will automaticaly run your tests against Pinecone Local when the events you specified in your workflow occur.

For a list of the events that can trigger a workflow and more details about using GitHub Actions for CI/CD, see the [GitHub Actions documentation](https://docs.github.com/en/actions).
