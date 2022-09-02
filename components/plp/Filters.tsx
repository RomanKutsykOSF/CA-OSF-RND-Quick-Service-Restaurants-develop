import React, { LegacyRef } from "react";
import useOuterClick from "hooks/useOuterClick";

interface FilterValue {
    id: string;
    name: string;
    resultsCount?: number;
}
export interface Filter {
    id: string;
    name: string;
    isCategoryFilter: boolean;
    type: "boolean" | "checkboxGroup" | "radioGroup";
    values: FilterValue[];
}
export interface AppliedFilter {
    id: string;
    values: string[];
}

export interface FiltersProps {
    titleText: string;
    filterByText: string;
    resetText: string;
    filters: Filter[];
    resetFiltersCallback: () => void;
    toggleFilterCallback: (filterId: string, filterValue: string) => void;
    setFiltersExpandedCallback: (isExpanded: boolean) => void;
    isFiltersExpanded: boolean;
    appliedFilters: AppliedFilter[];
}

const Filters = ({
    titleText,
    filterByText,
    isFiltersExpanded,
    setFiltersExpandedCallback,
    resetFiltersCallback,
    toggleFilterCallback,
    appliedFilters,
    resetText,
    filters,
}: FiltersProps): JSX.Element => {
    const innerRef = useOuterClick(() => {
        setFiltersExpandedCallback(false);
    });

    function generateFilterHtml({ id: filterId, name, type, values: filterValues }): JSX.Element | "" {
        const isBooleanFilterChecked = appliedFilters.filter((appliedFilter) => {
            return appliedFilter.id == filterId && appliedFilter?.values?.includes("true") ? true : false;
        }).length
            ? true
            : false;
        switch (type) {
            case "boolean":
                return filterValues
                    ? filterValues?.map((filterValue) => {
                          if (filterValue.id == "true") {
                              return (
                                  <section key={`filter__${filterId}`} className="filter">
                                      <hr className="my-2" />
                                      <input
                                          className="mr-3 cursor-pointer"
                                          type="checkbox"
                                          id={`filter__${filterId}`}
                                          name={filterId}
                                          checked={isBooleanFilterChecked}
                                          onChange={() => {
                                              toggleFilterCallback(filterId, "true");
                                              setFiltersExpandedCallback(false);
                                          }}
                                      />
                                      <label className="cursor-pointer" htmlFor={`filter__${filterId}`}>
                                          {name} ({filterValue?.resultsCount})
                                      </label>
                                  </section>
                              );
                          } else {
                              return "";
                          }
                      })
                    : "";
            case "checkboxGroup":
                return filterValues ? (
                    <section key={`filter__${filterId}`} className="filter">
                        <hr className="my-2" />
                        <p className="whitespace-nowrap mr-14 text-sm font-bold text-t-secondary font-primary">
                            {name}
                        </p>

                        {filterValues?.map((filterValue) => {
                            const isOneOfFilterValuesApplied = appliedFilters.filter((filter) => {
                                if (filter.id == filterId) {
                                    return filter.values.length ? true : false;
                                }
                            }).length
                                ? true
                                : false;

                            return (
                                <section className="filter__item" key={`filter__${filterId}-${filterValue?.id}`}>
                                    {isOneOfFilterValuesApplied ? (
                                        <>
                                            {appliedFilters.filter((appliedFilter) => {
                                                return appliedFilter.id == filterId &&
                                                    appliedFilter?.values?.includes(filterValue?.id)
                                                    ? true
                                                    : false;
                                            }).length ? (
                                                <>
                                                    <input
                                                        className="mr-3 cursor-pointer"
                                                        type="checkbox"
                                                        id={`filter__${filterId}-${filterValue?.id}`}
                                                        value={filterValue?.id}
                                                        checked={true}
                                                        onChange={() => {
                                                            toggleFilterCallback(filterId, filterValue?.id);
                                                            setFiltersExpandedCallback(false);
                                                        }}
                                                    />
                                                    <label
                                                        className="cursor-pointer"
                                                        htmlFor={`filter__${filterId}-${filterValue?.id}`}
                                                    >
                                                        {filterValue?.name} ({filterValue?.resultsCount})
                                                    </label>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                className="mr-3 cursor-pointer"
                                                type="checkbox"
                                                id={`filter__${filterId}-${filterValue?.id}`}
                                                value={filterValue?.id}
                                                checked={
                                                    appliedFilters.filter((appliedFilter) => {
                                                        return appliedFilter.id == filterId &&
                                                            appliedFilter?.values?.includes(filterValue?.id)
                                                            ? true
                                                            : false;
                                                    }).length
                                                        ? true
                                                        : false
                                                }
                                                onChange={() => {
                                                    toggleFilterCallback(filterId, filterValue?.id);
                                                    setFiltersExpandedCallback(false);
                                                }}
                                            />
                                            <label
                                                className="cursor-pointer"
                                                htmlFor={`filter__${filterId}-${filterValue?.id}`}
                                            >
                                                {filterValue?.name} ({filterValue?.resultsCount})
                                            </label>
                                        </>
                                    )}
                                </section>
                            );
                        })}
                    </section>
                ) : (
                    ""
                );
            case "radioGroup":
                return filterValues ? (
                    <section key={`filter__${filterId}`} className="filter">
                        <hr className="my-2" />
                        <p className="whitespace-nowrap mr-14 text-sm font-bold text-t-secondary font-primary">
                            {name}
                        </p>

                        {filterValues?.map((filterValue) => {
                            return (
                                <section className="filter__item" key={`filter__${filterId}-${filterValue?.id}`}>
                                    <input
                                        className="mr-3 cursor-pointer"
                                        type="radio"
                                        name={filterId}
                                        id={`filter__${filterId}-${filterValue?.id}`}
                                        value={filterValue?.id}
                                        checked={
                                            appliedFilters.filter((appliedFilter) => {
                                                return appliedFilter.id == filterId &&
                                                    appliedFilter?.values?.includes(filterValue?.id)
                                                    ? true
                                                    : false;
                                            }).length
                                                ? true
                                                : false
                                        }
                                        readOnly
                                        onClick={() => {
                                            toggleFilterCallback(filterId, filterValue?.id);
                                            setFiltersExpandedCallback(false);
                                        }}
                                    />
                                    <label
                                        className="cursor-pointer"
                                        htmlFor={`filter__${filterId}-${filterValue?.id}`}
                                    >
                                        {filterValue?.name} ({filterValue?.resultsCount})
                                    </label>
                                </section>
                            );
                        })}
                    </section>
                ) : (
                    ""
                );
        }
    }

    return (
        <div
            ref={innerRef as LegacyRef<HTMLDivElement>}
            className={`relative filters ${isFiltersExpanded && "filters--expanded"}`}
        >
            <button
                className="rounded-3xl border border-br-primary px-3 leading-9 font-bold text-t-tertiary"
                onClick={() => {
                    setFiltersExpandedCallback(!isFiltersExpanded);
                }}
            >
                {titleText}
                <span className="float-left transform rotate-90 icon-sliders" />
            </button>
            <div className="absolute rounded-lg p-4 shadow-md z-10 filters__overlay">
                <div className="flex justify-between">
                    <p className="whitespace-nowrap mr-14 text-sm font-bold text-t-secondary font-primary">
                        {filterByText}
                    </p>

                    <button className="whitespace-nowrap underline text-t-secondary-2" onClick={resetFiltersCallback}>
                        {resetText}
                    </button>
                </div>
                <div className="filters__list">
                    {filters?.map((filterData) => {
                        return generateFilterHtml(filterData);
                    })}
                </div>
            </div>
            <style jsx>{`
                .filters__overlay {
                    top: calc(100% + 15px);
                    right: 0;
                    display: none;
                    background: var(--t-tertiary);
                }

                .filters--expanded .filters__overlay {
                    display: block;
                }
            `}</style>
        </div>
    );
};

export default Filters;
