# Embedding values changed when upserted

There are two distinct cases in which you might notice that the values of your embeddings appear different in Pinecone than the floats you upserted.

If you use a pod-based index with `p2` pods, we use quantization to enable the [Pinecone Graph Algorithm.](https://www.pinecone.io/blog/hnsw-not-enough/#:~:text=built%20vector%20databases.-,The%20Pinecone%20Graph%20Algorithm,-In%20order%20to) This is utilized only in `p2` indexes and powers faster query paths and greater QPS capacities.

For all serverless and other pod-based indexes, you may see slightly different values in Pinecone for high-precision floats. What’s happening here is a result of the fact that fractions can’t be accurately represented in fixed amounts of memory. Different numbers might be mapped to the same bit representation, according to a standard known as [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754). More specifically, at Pinecone, we use Rust’s `f32` type, which is more commonly known as a `float` in Java, C, C++, and Python.

If you take these numbers and look at their physical memory representation, you’ll see that each float maps to the same representation before and after we upsert the vector to Pinecone. Our team built a [small demonstration in Rust](https://play.rust-lang.org/?version=stable\&mode=debug\&edition=2021\&gist=3584c20894714c5cba47127a036678fa) that you can use to explore some examples. We've also included a sample result in the attached screenshot.

This behavior is common across every system in the world, and the general trend in machine learning has been to reduce accuracy even more (see Google’s [bfloat16](https://en.wikipedia.org/wiki/Bfloat16_floating-point_format), which is now also standardized).

![A screenshot of the Rust demonstration, showing that two different floats have the same memory representation in bits.](https://mintlify.s3.us-west-1.amazonaws.com/pinecone/troubleshooting/images/float_memory_representation.png)
