import type { Invoice, InvoiceItem } from "../../types/invoice";
import type { InvoiceUpdater } from "../../types/invoiceUpdater";
import type { ValidationErrors } from "../../types/validation";
import { Plus, Trash2, Package } from "lucide-react";

type Props = {
  invoice: Invoice;
  setInvoice: InvoiceUpdater;
  errors: ValidationErrors;
};

export default function ItemsSection({ invoice, setInvoice, errors }: Props) {
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      name: "",
      qty: 1,
      price: 0,
    };

    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (index: number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-sky-100 shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-sky-100 flex justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 cursor-pointer h-10 rounded-xl bg-sky-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-sky-600" />
          </div>
          <h2 className="text-lg font-semibold text-indigo-900">Items</h2>
        </div>

        {errors["items"] && (
          <p className="text-sm text-red-600">{errors["items"]}</p>
        )}
      </div>

      <div className="p-6 space-y-6">
        {invoice.items.map((item, index) => (
          <div
            key={item.id}
            className="relative rounded-xl border border-sky-200 p-5"
          >
            <button
              onClick={() => removeItem(index)}
              className="absolute right-3 cursor-pointer top-3 text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Item Name */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Item Name *
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3"
                  maxLength={60}
                  value={item.name}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      items: prev.items.map((it, i) =>
                        i === index
                          ? {
                              ...it,
                              name: e.target.value.replace(
                                /[^A-Za-z0-9 .-]/g,
                                ""
                              ),
                            }
                          : it
                      ),
                    }))
                  }
                />
                {errors[`items.${index}.name`] && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors[`items.${index}.name`]}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Quantity *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3"
                  value={item.qty}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    const qty = Math.min(Number(v || 0), 10_000);
                    setInvoice((prev) => ({
                      ...prev,
                      items: prev.items.map((it, i) =>
                        i === index ? { ...it, qty } : it
                      ),
                    }));
                  }}
                />
                {errors[`items.${index}.qty`] && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors[`items.${index}.qty`]}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Unit Price *
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="mt-1 w-full rounded-lg border border-sky-200 px-4 py-3"
                  value={item.price}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9.]/g, "");
                    const price = Math.min(Number(v || 0), 10_000_000);
                    setInvoice((prev) => ({
                      ...prev,
                      items: prev.items.map((it, i) =>
                        i === index ? { ...it, price } : it
                      ),
                    }));
                  }}
                />
                {errors[`items.${index}.price`] && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors[`items.${index}.price`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-5 border-t border-sky-100">
        <button
          onClick={addItem}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-white"
        >
          <Plus className="w-5 h-5" /> Add Item
        </button>
      </div>
    </div>
  );
}
