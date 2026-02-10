import CustomerForm from "./CustomerForm";
import ProductForm from "./ProductForm";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Store</h1>
        <p>Manage customers and products</p>
      </header>
      <main className="app-main">
        <CustomerForm />
        <ProductForm />
      </main>
    </div>
  );
}

export default App;
