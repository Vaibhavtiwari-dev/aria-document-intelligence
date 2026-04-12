import json
from langchain_google_genai import ChatGoogleGenerativeAI
from src.services.vectorstore import get_collection
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Core models
embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", streaming=True)

async def ask_question(workspace_id: str, query: str):
    """
    RAG Pipeline for answering user questions based on their workspace documents.
    Streams the response back as SSE.
    """
    collection = get_collection(workspace_id)
    
    # Embed query
    query_vector = embeddings_model.embed_query(query)

    # Retrieve relevant chunks from Chroma
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=5
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    # Format context
    context_parts = []
    for doc, meta in zip(documents, metadatas):
        source = meta.get("source", "Unknown")
        context_parts.append(f"Source: {source}\nContent: {doc}")
    
    context_string = "\n\n---\n\n".join(context_parts)

    system_prompt = (
        "You are Aria, an AI Document Intelligence Platform. "
        "Answer the user's question using ONLY the provided context from their documents. "
        "If the answer is not contained in the context, state that you cannot answer it based on the uploaded documents. "
        "Always cite your sources by referencing the Source filename."
    )

    prompt = f"{system_prompt}\n\nContext:\n{context_string}\n\nQuestion:\n{query}"

    # Stream the output
    async for chunk in llm.astream(prompt):
        # Format as Server-Sent Events (SSE)
        yield f"data: {json.dumps({'chunk': chunk.content})}\n\n"
